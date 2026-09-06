import type { StorageStrategy, StorageTarget } from "../../types/index.js";
/**
 * Base strategy handling safe JSON serialization over a Web Storage backend.
 */
declare abstract class WebStorageStrategy implements StorageStrategy {
    private readonly storage;
    protected constructor(storage: Storage);
    useGetItem<T = unknown>(key: string): T | null;
    useSetItem(key: string, value: unknown): void;
    useRemoveItem(key: string): void;
    useClear(): void;
}
/**
 * Concrete strategy backed by `window.localStorage`.
 */
export declare class LocalStorageStrategy extends WebStorageStrategy {
    constructor(storage?: Storage);
}
/**
 * Concrete strategy backed by `window.sessionStorage`.
 */
export declare class SessionStorageStrategy extends WebStorageStrategy {
    constructor(storage?: Storage);
}
/**
 * Concrete strategy backed by an in-memory store (SSR / private-mode fallback).
 */
export declare class MemoryStorageStrategy extends WebStorageStrategy {
    constructor();
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
export declare function useRunStorageScope<T>(fn: () => T): T;
/**
 * Storage facade (Singleton + Strategy). Lazily picks browser storage or an
 * in-memory fallback so importing this module never crashes in SSR (Node/Bun).
 *
 * In SSR, strategies are **not** cached on the singleton (that would leak data
 * across requests). Prefer {@link useRunStorageScope} for request-scoped
 * persistence; without a scope, each call uses a fresh ephemeral store.
 */
export default class StorageService {
    private static instance;
    private browserStrategies;
    private constructor();
    static getInstance(): StorageService;
    private getStrategies;
    useGetStorage: <T = unknown>(key: string, target?: StorageTarget) => T | null;
    useSetStorage: (key: string, value: unknown, target?: StorageTarget) => void;
    useRemoveStorage: (key: string, target?: StorageTarget) => void;
    useClearStorage: (target?: StorageTarget) => void;
}
export declare const useClearStorage: (target?: StorageTarget) => void, useGetStorage: <T = unknown>(key: string, target?: StorageTarget) => T | null, useRemoveStorage: (key: string, target?: StorageTarget) => void, useSetStorage: (key: string, value: unknown, target?: StorageTarget) => void;
export {};
//# sourceMappingURL=storage.service.d.ts.map