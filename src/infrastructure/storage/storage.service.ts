import { AsyncLocalStorage } from "node:async_hooks";

import type { StorageStrategy, StorageTarget } from "../../types/index.js";

/**
 * Base strategy handling safe JSON serialization over a Web Storage backend.
 */
abstract class WebStorageStrategy implements StorageStrategy {
	protected constructor(private readonly storage: Storage) {}

	useGetItem<T = unknown>(key: string): T | null {
		try {
			const raw = this.storage.getItem(key);
			return raw ? (JSON.parse(raw) as T) : null;
		} catch {
			try {
				return this.storage.getItem(key) as unknown as T;
			} catch {
				return null;
			}
		}
	}

	useSetItem(key: string, value: unknown): void {
		try {
			const serialized = typeof value === "string" ? value : JSON.stringify(value);
			this.storage.setItem(key, serialized);
		} catch {
			// Quota exceeded, private mode, or unavailable storage — ignore.
		}
	}

	useRemoveItem(key: string): void {
		try {
			this.storage.removeItem(key);
		} catch {
			// Ignore unavailable storage.
		}
	}

	useClear(): void {
		try {
			this.storage.clear();
		} catch {
			// Ignore unavailable storage.
		}
	}
}

/**
 * In-memory Web Storage implementation used as an SSR / private-mode fallback.
 * Each instance owns its own Map — never share one across requests.
 */
class MemoryStorage implements Storage {
	private store = new Map<string, string>();

	get length(): number {
		return this.store.size;
	}

	clear(): void {
		this.store.clear();
	}

	getItem(key: string): string | null {
		return this.store.get(key) ?? null;
	}

	key(index: number): string | null {
		return Array.from(this.store.keys())[index] ?? null;
	}

	removeItem(key: string): void {
		this.store.delete(key);
	}

	setItem(key: string, value: string): void {
		this.store.set(key, value);
	}
}

/**
 * Concrete strategy backed by `window.localStorage`.
 */
export class LocalStorageStrategy extends WebStorageStrategy {
	constructor(storage: Storage = window.localStorage) {
		super(storage);
	}
}

/**
 * Concrete strategy backed by `window.sessionStorage`.
 */
export class SessionStorageStrategy extends WebStorageStrategy {
	constructor(storage: Storage = window.sessionStorage) {
		super(storage);
	}
}

/**
 * Concrete strategy backed by an in-memory store (SSR / private-mode fallback).
 */
export class MemoryStorageStrategy extends WebStorageStrategy {
	constructor() {
		super(new MemoryStorage());
	}
}

type StrategyMap = Record<StorageTarget, StorageStrategy>;

/** Request-scoped storage strategies for SSR (avoids cross-request leaks). */
const ssrStorageAls = new AsyncLocalStorage<StrategyMap>();

function createMemoryStrategies(): StrategyMap {
	return {
		localStorage: new MemoryStorageStrategy(),
		sessionStorage: new MemoryStorageStrategy(),
	};
}

function tryCreateBrowserStrategies(): StrategyMap {
	const local = tryCreateWebStorage("localStorage");
	const session = tryCreateWebStorage("sessionStorage");
	return {
		localStorage: local ?? new MemoryStorageStrategy(),
		sessionStorage: session ?? new MemoryStorageStrategy(),
	};
}

/**
 * Probes Web Storage availability (Safari private mode throws on setItem).
 */
function tryCreateWebStorage(kind: "localStorage" | "sessionStorage"): StorageStrategy | null {
	try {
		const storage = window[kind];
		const probeKey = "__kk_storage_probe__";
		storage.setItem(probeKey, "1");
		storage.removeItem(probeKey);
		return kind === "localStorage"
			? new LocalStorageStrategy(storage)
			: new SessionStorageStrategy(storage);
	} catch {
		return null;
	}
}

/**
 * Runs `fn` with request-isolated in-memory storage (SSR).
 * Use this around a request handler so `useSetStorage` / `useGetStorage`
 * share state within the request but not across requests.
 *
 * @example
 * ```ts
 * import { useRunStorageScope, useSetStorage, useGetStorage } from "katanakit-js";
 *
 * export default defineEventHandler((event) => {
 *   return useRunStorageScope(() => {
 *     useSetStorage("req-id", event.context.id);
 *     return useGetStorage("req-id");
 *   });
 * });
 * ```
 */
export function useRunStorageScope<T>(fn: () => T): T {
	return ssrStorageAls.run(createMemoryStrategies(), fn);
}

/**
 * Storage facade (Singleton + Strategy). Lazily picks browser storage or an
 * in-memory fallback so importing this module never crashes in SSR (Node/Bun).
 *
 * In SSR, strategies are **not** cached on the singleton (that would leak data
 * across requests). Prefer {@link useRunStorageScope} for request-scoped
 * persistence; without a scope, each call uses a fresh ephemeral store.
 */
export default class StorageService {
	private static instance: StorageService;
	private browserStrategies: StrategyMap | null = null;

	private constructor() {}

	public static getInstance(): StorageService {
		if (!StorageService.instance) {
			StorageService.instance = new StorageService();
		}
		return StorageService.instance;
	}

	private getStrategies(): StrategyMap {
		const hasWindow = typeof window !== "undefined";

		if (hasWindow) {
			if (!this.browserStrategies) {
				this.browserStrategies = tryCreateBrowserStrategies();
			}
			return this.browserStrategies;
		}

		// SSR: prefer ALS-scoped strategies (isolated per request).
		const scoped = ssrStorageAls.getStore();
		if (scoped) return scoped;

		// No scope — ephemeral store (no cross-request leak, no cross-call persistence).
		return createMemoryStrategies();
	}

	public useGetStorage = <T = unknown>(
		key: string,
		target: StorageTarget = "localStorage",
	): T | null => this.getStrategies()[target].useGetItem<T>(key);

	public useSetStorage = (
		key: string,
		value: unknown,
		target: StorageTarget = "localStorage",
	): void => this.getStrategies()[target].useSetItem(key, value);

	public useRemoveStorage = (key: string, target: StorageTarget = "localStorage"): void =>
		this.getStrategies()[target].useRemoveItem(key);

	public useClearStorage = (target: StorageTarget = "localStorage"): void =>
		this.getStrategies()[target].useClear();
}

// Singleton instance and destructured exports.
export const { useClearStorage, useGetStorage, useRemoveStorage, useSetStorage } =
	StorageService.getInstance();
