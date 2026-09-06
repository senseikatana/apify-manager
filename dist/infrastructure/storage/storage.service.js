import { AsyncLocalStorage } from "node:async_hooks";
/**
 * Base strategy handling safe JSON serialization over a Web Storage backend.
 */
class WebStorageStrategy {
    storage;
    constructor(storage) {
        this.storage = storage;
    }
    useGetItem(key) {
        try {
            const raw = this.storage.getItem(key);
            return raw ? JSON.parse(raw) : null;
        }
        catch {
            try {
                return this.storage.getItem(key);
            }
            catch {
                return null;
            }
        }
    }
    useSetItem(key, value) {
        try {
            const serialized = typeof value === "string" ? value : JSON.stringify(value);
            this.storage.setItem(key, serialized);
        }
        catch {
            // Quota exceeded, private mode, or unavailable storage — ignore.
        }
    }
    useRemoveItem(key) {
        try {
            this.storage.removeItem(key);
        }
        catch {
            // Ignore unavailable storage.
        }
    }
    useClear() {
        try {
            this.storage.clear();
        }
        catch {
            // Ignore unavailable storage.
        }
    }
}
/**
 * In-memory Web Storage implementation used as an SSR / private-mode fallback.
 * Each instance owns its own Map — never share one across requests.
 */
class MemoryStorage {
    store = new Map();
    get length() {
        return this.store.size;
    }
    clear() {
        this.store.clear();
    }
    getItem(key) {
        return this.store.get(key) ?? null;
    }
    key(index) {
        return Array.from(this.store.keys())[index] ?? null;
    }
    removeItem(key) {
        this.store.delete(key);
    }
    setItem(key, value) {
        this.store.set(key, value);
    }
}
/**
 * Concrete strategy backed by `window.localStorage`.
 */
export class LocalStorageStrategy extends WebStorageStrategy {
    constructor(storage = window.localStorage) {
        super(storage);
    }
}
/**
 * Concrete strategy backed by `window.sessionStorage`.
 */
export class SessionStorageStrategy extends WebStorageStrategy {
    constructor(storage = window.sessionStorage) {
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
/** Request-scoped storage strategies for SSR (avoids cross-request leaks). */
const ssrStorageAls = new AsyncLocalStorage();
function createMemoryStrategies() {
    return {
        localStorage: new MemoryStorageStrategy(),
        sessionStorage: new MemoryStorageStrategy(),
    };
}
function tryCreateBrowserStrategies() {
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
function tryCreateWebStorage(kind) {
    try {
        const storage = window[kind];
        const probeKey = "__kk_storage_probe__";
        storage.setItem(probeKey, "1");
        storage.removeItem(probeKey);
        return kind === "localStorage"
            ? new LocalStorageStrategy(storage)
            : new SessionStorageStrategy(storage);
    }
    catch {
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
export function useRunStorageScope(fn) {
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
    static instance;
    browserStrategies = null;
    constructor() { }
    static getInstance() {
        if (!StorageService.instance) {
            StorageService.instance = new StorageService();
        }
        return StorageService.instance;
    }
    getStrategies() {
        const hasWindow = typeof window !== "undefined";
        if (hasWindow) {
            if (!this.browserStrategies) {
                this.browserStrategies = tryCreateBrowserStrategies();
            }
            return this.browserStrategies;
        }
        // SSR: prefer ALS-scoped strategies (isolated per request).
        const scoped = ssrStorageAls.getStore();
        if (scoped)
            return scoped;
        // No scope — ephemeral store (no cross-request leak, no cross-call persistence).
        return createMemoryStrategies();
    }
    useGetStorage = (key, target = "localStorage") => this.getStrategies()[target].useGetItem(key);
    useSetStorage = (key, value, target = "localStorage") => this.getStrategies()[target].useSetItem(key, value);
    useRemoveStorage = (key, target = "localStorage") => this.getStrategies()[target].useRemoveItem(key);
    useClearStorage = (target = "localStorage") => this.getStrategies()[target].useClear();
}
// Singleton instance and destructured exports.
export const { useClearStorage, useGetStorage, useRemoveStorage, useSetStorage } = StorageService.getInstance();
//# sourceMappingURL=storage.service.js.map