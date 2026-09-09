import { AsyncLocalStorage } from "node:async_hooks";
// ============================================================
// Strategy factories (plain objects implementing StorageStrategy)
// ============================================================
/**
 * Creates a `StorageStrategy` backed by a Web Storage backend (`localStorage`
 * or `sessionStorage`) with safe JSON serialization and error handling.
 *
 * @param storage - A native `Storage` instance (e.g. `window.localStorage`).
 * @returns A {@link StorageStrategy} object.
 */
function createWebStorageStrategy(storage) {
    return {
        useGetItem(key) {
            try {
                const raw = storage.getItem(key);
                return raw ? JSON.parse(raw) : null;
            }
            catch {
                try {
                    return storage.getItem(key);
                }
                catch {
                    return null;
                }
            }
        },
        useSetItem(key, value) {
            try {
                const serialized = typeof value === "string" ? value : JSON.stringify(value);
                storage.setItem(key, serialized);
            }
            catch {
                // Quota exceeded, private mode, or unavailable storage — ignore.
            }
        },
        useRemoveItem(key) {
            try {
                storage.removeItem(key);
            }
            catch {
                // Ignore unavailable storage.
            }
        },
        useClear() {
            try {
                storage.clear();
            }
            catch {
                // Ignore unavailable storage.
            }
        },
    };
}
// ============================================================
// In-memory Storage implementation
// ============================================================
/**
 * In-memory `Storage` implementation used as an SSR / private-mode fallback.
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
 * Creates a new in-memory `Storage` instance.
 *
 * @returns A fresh `MemoryStorage` that conforms to the Web Storage API.
 *
 * @example
 * ```ts
 * const mem = createMemoryStorage();
 * mem.setItem("key", JSON.stringify({ a: 1 }));
 * ```
 */
export function createMemoryStorage() {
    return new MemoryStorage();
}
// ============================================================
// Concrete strategy factories
// ============================================================
/**
 * Creates a strategy backed by `window.localStorage`.
 *
 * @param storage - Optional storage instance (defaults to `window.localStorage`).
 * @returns A {@link StorageStrategy}.
 *
 * @example
 * ```ts
 * const strategy = LocalStorageStrategy();
 * strategy.useSetItem("token", "abc123");
 * ```
 */
export function LocalStorageStrategy(storage = window.localStorage) {
    return createWebStorageStrategy(storage);
}
/**
 * Creates a strategy backed by `window.sessionStorage`.
 *
 * @param storage - Optional storage instance (defaults to `window.sessionStorage`).
 * @returns A {@link StorageStrategy}.
 *
 * @example
 * ```ts
 * const strategy = SessionStorageStrategy();
 * strategy.useSetItem("session", data);
 * ```
 */
export function SessionStorageStrategy(storage = window.sessionStorage) {
    return createWebStorageStrategy(storage);
}
/**
 * Creates a strategy backed by an in-memory store (SSR / private-mode fallback).
 *
 * @returns A {@link StorageStrategy} using an in-memory `Storage` backend.
 *
 * @example
 * ```ts
 * const strategy = MemoryStorageStrategy();
 * strategy.useSetItem("temp", "value");
 * ```
 */
export function MemoryStorageStrategy() {
    return createWebStorageStrategy(createMemoryStorage());
}
/** Request-scoped storage strategies for SSR (avoids cross-request leaks). */
const ssrStorageAls = new AsyncLocalStorage();
/** Lazily-initialized browser strategies (cached once). */
let browserStrategies = null;
function createMemoryStrategies() {
    return {
        localStorage: MemoryStorageStrategy(),
        sessionStorage: MemoryStorageStrategy(),
    };
}
function tryCreateBrowserStrategies() {
    const local = tryCreateWebStorage("localStorage");
    const session = tryCreateWebStorage("sessionStorage");
    return {
        localStorage: local ?? MemoryStorageStrategy(),
        sessionStorage: session ?? MemoryStorageStrategy(),
    };
}
/**
 * Probes Web Storage availability (Safari private mode throws on setItem).
 *
 * @param kind - Which storage backend to probe.
 * @returns A {@link StorageStrategy} or `null` if the backend is unavailable.
 */
function tryCreateWebStorage(kind) {
    try {
        const storage = window[kind];
        const probeKey = "__kk_storage_probe__";
        storage.setItem(probeKey, "1");
        storage.removeItem(probeKey);
        return kind === "localStorage" ? LocalStorageStrategy(storage) : SessionStorageStrategy(storage);
    }
    catch {
        return null;
    }
}
/**
 * Resolves the active strategy map: browser strategies (cached), ALS-scoped
 * strategies (SSR request), or ephemeral memory strategies (SSR fallback).
 */
function getStrategies() {
    const hasWindow = typeof window !== "undefined";
    if (hasWindow) {
        if (!browserStrategies) {
            browserStrategies = tryCreateBrowserStrategies();
        }
        return browserStrategies;
    }
    // SSR: prefer ALS-scoped strategies (isolated per request).
    const scoped = ssrStorageAls.getStore();
    if (scoped)
        return scoped;
    // No scope — ephemeral store (no cross-request leak, no cross-call persistence).
    return createMemoryStrategies();
}
// ============================================================
// Public API
// ============================================================
/**
 * Runs `fn` with request-isolated in-memory storage (SSR).
 * Use this around a request handler so `useSetStorage` / `useGetStorage`
 * share state within the request but not across requests.
 *
 * @typeParam T - Return type of `fn`.
 * @param fn - The function to run within the storage scope.
 * @returns The return value of `fn`.
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
 * Retrieves a value from storage by key.
 *
 * @typeParam T - Expected value type.
 * @param key - The storage key.
 * @param target - Which storage backend to use (default: `"localStorage"`).
 * @returns The deserialized value, or `null` if not found.
 *
 * @example
 * ```ts
 * const token = useGetStorage<string>("auth_token");
 * const session = useGetStorage<SessionData>("session", "sessionStorage");
 * ```
 */
export const useGetStorage = (key, target = "localStorage") => getStrategies()[target].useGetItem(key);
/**
 * Stores a value under the given key (serialized as JSON).
 *
 * @param key - The storage key.
 * @param value - The value to store.
 * @param target - Which storage backend to use (default: `"localStorage"`).
 *
 * @example
 * ```ts
 * useSetStorage("auth_token", "abc123");
 * useSetStorage("user", { name: "Alice" }, "sessionStorage");
 * ```
 */
export const useSetStorage = (key, value, target = "localStorage") => getStrategies()[target].useSetItem(key, value);
/**
 * Removes a value from storage by key.
 *
 * @param key - The storage key to remove.
 * @param target - Which storage backend to use (default: `"localStorage"`).
 *
 * @example
 * ```ts
 * useRemoveStorage("auth_token");
 * ```
 */
export const useRemoveStorage = (key, target = "localStorage") => getStrategies()[target].useRemoveItem(key);
/**
 * Clears all values from the specified storage backend.
 *
 * @param target - Which storage backend to clear (default: `"localStorage"`).
 *
 * @example
 * ```ts
 * useClearStorage("sessionStorage");
 * ```
 */
export const useClearStorage = (target = "localStorage") => getStrategies()[target].useClear();
//# sourceMappingURL=storage.service.js.map