import { type MaybeRef, type Ref } from "vue";
import type { ApiError, UrlOptions } from "../../types/index.js";
/**
 * Reactive state exposed by the {@link useKatanaFetch} composable.
 */
export interface KatanaFetchState<T> {
    /** The resolved data on success, `null` otherwise. */
    data: Ref<T | null>;
    /** The Safe Result error on failure, `null` otherwise. */
    error: Ref<ApiError | null>;
    /** Whether a request is in flight. */
    loading: Ref<boolean>;
    /** Re-runs the request manually. */
    refetch: () => Promise<void>;
}
/**
 * Vue 3 composable that wraps KatanaKit's HTTP GET with the reactivity system.
 * It bridges the Safe Result pattern to idiomatic Vue state (`data`, `error`,
 * `loading`) and never throws on HTTP errors.
 *
 * Stale responses are ignored via a request version counter and AbortController.
 * In-flight requests are aborted on unmount when `onUnmounted` is available.
 *
 * When `options` is a Vue `Ref`, the request re-runs automatically whenever the
 * ref changes (deep watch), so URL params or query params can drive refetching.
 *
 * @param apiName - Name of the registered API (see `useInitApis`).
 * @param endpointName - Name of the endpoint inside that API.
 * @param options - Optional `UrlOptions` (path/query params), plain or reactive.
 * @returns Reactive `{ data, error, loading, refetch }`.
 *
 * @example
 * ```ts
 * import { useKatanaFetch } from "katanakit-js/adapters/vue";
 *
 * const { data, error, loading } = useKatanaFetch<{ name: string }>(
 *   "pokeapi",
 *   "pokemonById",
 *   { params: { id: 25 } },
 * );
 * ```
 */
export declare function useKatanaFetch<T>(apiName: string, endpointName: string, options?: MaybeRef<UrlOptions>): KatanaFetchState<T>;
//# sourceMappingURL=vue.service.d.ts.map