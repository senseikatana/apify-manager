import type { ApisConfig, FetchOptions, FetchResult, IFetchApiManager, UrlOptions } from "../../types/index.js";
/**
 * Framework-agnostic HTTP client: builds safe URLs from a JSON-defined registry
 * and wraps `fetch` in a Safe Result. Implemented as a Facade + Singleton.
 */
export declare class FetchApiManager implements IFetchApiManager {
    private static instance;
    private apis;
    private constructor();
    static getInstance(): FetchApiManager;
    /**
     * Registers (merges) API definitions into the client registry.
     * Prefer the clearer alias {@link useInitApis}.
     */
    useInit: (apis: ApisConfig) => void;
    /**
     * Registers (merges) API definitions into the client registry.
     */
    useInitApis: (apis: ApisConfig) => void;
    /**
     * Returns a shallow copy of the registered APIs (safe to mutate locally).
     */
    useGetApis: () => ApisConfig;
    /**
     * Alias for {@link useGetApis}.
     */
    useGetApisConfig: () => ApisConfig;
    private GET_API_ENTRY;
    useBuildUrl: (apiName: string, endpointName: string, options?: UrlOptions) => string;
    /**
     * Alias for {@link useBuildUrl}.
     */
    useBuildApiUrl: (apiName: string, endpointName: string, options?: UrlOptions) => string;
    private READ_BODY;
    useFetch: <T = unknown>(apiName: string, endpointName: string, { urlOptions, ...init }?: FetchOptions) => Promise<FetchResult<T>>;
    /**
     * Alias for {@link useFetch}.
     */
    useFetchApi: <T = unknown>(apiName: string, endpointName: string, options?: FetchOptions) => Promise<FetchResult<T>>;
    useGet: <T = unknown>(apiName: string, endpointName: string, urlOptions?: UrlOptions) => Promise<FetchResult<T>>;
    /**
     * Alias for {@link useGet}.
     */
    useGetApi: <T = unknown>(apiName: string, endpointName: string, urlOptions?: UrlOptions) => Promise<FetchResult<T>>;
    usePost: <T = unknown>(apiName: string, endpointName: string, body?: unknown, urlOptions?: UrlOptions) => Promise<FetchResult<T>>;
    usePut: <T = unknown>(apiName: string, endpointName: string, body?: unknown, urlOptions?: UrlOptions) => Promise<FetchResult<T>>;
    usePatch: <T = unknown>(apiName: string, endpointName: string, body?: unknown, urlOptions?: UrlOptions) => Promise<FetchResult<T>>;
    useDelete: <T = unknown>(apiName: string, endpointName: string, urlOptions?: UrlOptions) => Promise<FetchResult<T>>;
    /**
     * Serializes a request body: leaves FormData / Blob / URLSearchParams /
     * ArrayBuffer / TypedArray / ReadableStream untouched (no forced JSON
     * Content-Type so the runtime can set the multipart boundary).
     */
    private SERIALIZE_BODY;
}
/**
 * Registers (merges) API definitions into the client registry.
 *
 * @example
 * ```ts
 * import { useInitApis } from "katanakit-js";
 *
 * useInitApis({
 *   pokeapi: {
 *     baseUri: "https://pokeapi.co/api/v2",
 *     endpoints: { pokemonById: "/pokemon/:id/" },
 *   },
 * });
 * ```
 */
export declare function useInitApis(apis: ApisConfig): void;
/**
 * @deprecated Use {@link useInitApis} for a clearer name.
 */
export declare function useInit(apis: ApisConfig): void;
/**
 * Returns a shallow copy of the registered APIs.
 *
 * @example
 * ```ts
 * import { useGetApisConfig } from "katanakit-js";
 * const apis = useGetApisConfig();
 * ```
 */
export declare function useGetApisConfig(): ApisConfig;
/**
 * @deprecated Prefer {@link useGetApisConfig}.
 */
export declare function useGetApis(): ApisConfig;
/**
 * Builds a safe http(s) URL from a registered API + endpoint.
 *
 * @example
 * ```ts
 * import { useBuildApiUrl } from "katanakit-js";
 * const url = useBuildApiUrl("pokeapi", "pokemonById", { params: { id: 25 } });
 * ```
 */
export declare function useBuildApiUrl(apiName: string, endpointName: string, options?: UrlOptions): string;
/**
 * @deprecated Prefer {@link useBuildApiUrl}.
 */
export declare function useBuildUrl(apiName: string, endpointName: string, options?: UrlOptions): string;
/**
 * Fetches a registered endpoint and returns a Safe Result.
 *
 * @example
 * ```ts
 * import { useFetchApi } from "katanakit-js";
 * const result = await useFetchApi("pokeapi", "pokemonById", {
 *   method: "GET",
 *   urlOptions: { params: { id: 25 } },
 * });
 * if (result.ok) console.log(result.data);
 * ```
 */
export declare function useFetchApi<T = unknown>(apiName: string, endpointName: string, options?: FetchOptions): Promise<FetchResult<T>>;
/**
 * @deprecated Prefer {@link useFetchApi}.
 */
export declare function useFetch<T = unknown>(apiName: string, endpointName: string, options?: FetchOptions): Promise<FetchResult<T>>;
/**
 * GET helper over a registered API endpoint.
 *
 * @example
 * ```ts
 * import { useGetApi } from "katanakit-js";
 * const result = await useGetApi<{ name: string }>("pokeapi", "pokemonById", {
 *   params: { id: 25 },
 * });
 * ```
 */
export declare function useGetApi<T = unknown>(apiName: string, endpointName: string, urlOptions?: UrlOptions): Promise<FetchResult<T>>;
/**
 * @deprecated Prefer {@link useGetApi}.
 */
export declare function useGet<T = unknown>(apiName: string, endpointName: string, urlOptions?: UrlOptions): Promise<FetchResult<T>>;
/** POST helper over a registered API endpoint. */
export declare function usePost<T = unknown>(apiName: string, endpointName: string, body?: unknown, urlOptions?: UrlOptions): Promise<FetchResult<T>>;
/** PUT helper over a registered API endpoint. */
export declare function usePut<T = unknown>(apiName: string, endpointName: string, body?: unknown, urlOptions?: UrlOptions): Promise<FetchResult<T>>;
/** PATCH helper over a registered API endpoint. */
export declare function usePatch<T = unknown>(apiName: string, endpointName: string, body?: unknown, urlOptions?: UrlOptions): Promise<FetchResult<T>>;
/** DELETE helper over a registered API endpoint. */
export declare function useDelete<T = unknown>(apiName: string, endpointName: string, urlOptions?: UrlOptions): Promise<FetchResult<T>>;
//# sourceMappingURL=http.service.d.ts.map