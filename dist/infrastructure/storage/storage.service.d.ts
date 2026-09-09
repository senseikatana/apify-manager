import type { StorageStrategy, StorageTarget } from "../../types/index.js";
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
export declare function createMemoryStorage(): Storage;
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
export declare function LocalStorageStrategy(storage?: Storage): StorageStrategy;
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
export declare function SessionStorageStrategy(storage?: Storage): StorageStrategy;
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
export declare function MemoryStorageStrategy(): StorageStrategy;
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
export declare function useRunStorageScope<T>(fn: () => T): T;
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
export declare const useGetStorage: <T = unknown>(key: string, target?: StorageTarget) => T | null;
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
export declare const useSetStorage: (key: string, value: unknown, target?: StorageTarget) => void;
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
export declare const useRemoveStorage: (key: string, target?: StorageTarget) => void;
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
export declare const useClearStorage: (target?: StorageTarget) => void;
//# sourceMappingURL=storage.service.d.ts.map