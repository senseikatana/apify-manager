import type { ApisConfig, FetchOptions, FetchResult, UrlOptions } from "../../types/index.js";
/**
 * Registers (merges) API definitions into the client registry.
 * Prefer the clearer alias {@link useInitApis}.
 *
 * @param apisConfig - The API definitions to merge into the registry.
 *
 * @example
 * ```ts
 * import { useInit } from "katanakit-js";
 *
 * useInit({
 *   pokeapi: {
 *     baseUri: "https://pokeapi.co/api/v2",
 *     endpoints: { pokemonById: "/pokemon/:id/" },
 *   },
 * });
 * ```
 */
export declare function useInit(apisConfig: ApisConfig): void;
/**
 * Registers (merges) API definitions into the client registry.
 *
 * @param apisConfig - The API definitions to merge into the registry.
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
export declare function useInitApis(apisConfig: ApisConfig): void;
/**
 * Returns a shallow copy of the registered APIs (safe to mutate locally).
 *
 * @returns A shallow copy of the current API registry.
 *
 * @example
 * ```ts
 * import { useGetApis } from "katanakit-js";
 *
 * const apis = useGetApis();
 * ```
 */
export declare function useGetApis(): ApisConfig;
/**
 * Returns a shallow copy of the registered APIs.
 * Alias for {@link useGetApis}.
 *
 * @returns A shallow copy of the current API registry.
 *
 * @example
 * ```ts
 * import { useGetApisConfig } from "katanakit-js";
 *
 * const apis = useGetApisConfig();
 * ```
 */
export declare function useGetApisConfig(): ApisConfig;
/**
 * Builds a safe http(s) URL from a registered API + endpoint.
 *
 * @param apiName - The registered API key.
 * @param endpointName - The endpoint key within the API.
 * @param options - Optional URL building options (params, query, ignoreDefaultQuery).
 * @returns The fully constructed URL string.
 * @throws {Error} If the API or endpoint is not registered, or the URL scheme is not http(s).
 *
 * @example
 * ```ts
 * import { useBuildUrl } from "katanakit-js";
 *
 * const url = useBuildUrl("pokeapi", "pokemonById", { params: { id: 25 } });
 * ```
 */
export declare function useBuildUrl(apiName: string, endpointName: string, options?: UrlOptions): string;
/**
 * Builds a safe http(s) URL from a registered API + endpoint.
 * Alias for {@link useBuildUrl}.
 *
 * @param apiName - The registered API key.
 * @param endpointName - The endpoint key within the API.
 * @param options - Optional URL building options.
 * @returns The fully constructed URL string.
 *
 * @example
 * ```ts
 * import { useBuildApiUrl } from "katanakit-js";
 *
 * const url = useBuildApiUrl("pokeapi", "pokemonById", { params: { id: 25 } });
 * ```
 */
export declare function useBuildApiUrl(apiName: string, endpointName: string, options?: UrlOptions): string;
/**
 * Fetches a registered endpoint and returns a Safe Result.
 *
 * @param apiName - The registered API key.
 * @param endpointName - The endpoint key within the API.
 * @param options - Optional fetch options (method, headers, body, urlOptions).
 * @returns A {@link FetchResult} with data or error.
 *
 * @example
 * ```ts
 * import { useFetch } from "katanakit-js";
 *
 * const result = await useFetch("pokeapi", "pokemonById", {
 *   method: "GET",
 *   urlOptions: { params: { id: 25 } },
 * });
 * if (result.ok) console.log(result.data);
 * ```
 */
export declare function useFetch<T = unknown>(apiName: string, endpointName: string, { urlOptions, ...init }?: FetchOptions): Promise<FetchResult<T>>;
/**
 * Fetches a registered endpoint and returns a Safe Result.
 * Alias for {@link useFetch}.
 *
 * @param apiName - The registered API key.
 * @param endpointName - The endpoint key within the API.
 * @param options - Optional fetch options.
 * @returns A {@link FetchResult} with data or error.
 *
 * @example
 * ```ts
 * import { useFetchApi } from "katanakit-js";
 *
 * const result = await useFetchApi("pokeapi", "pokemonById", {
 *   method: "GET",
 *   urlOptions: { params: { id: 25 } },
 * });
 * if (result.ok) console.log(result.data);
 * ```
 */
export declare function useFetchApi<T = unknown>(apiName: string, endpointName: string, options?: FetchOptions): Promise<FetchResult<T>>;
/**
 * GET helper over a registered API endpoint.
 *
 * @param apiName - The registered API key.
 * @param endpointName - The endpoint key within the API.
 * @param urlOptions - Optional URL building options.
 * @returns A {@link FetchResult} with data or error.
 *
 * @example
 * ```ts
 * import { useGet } from "katanakit-js";
 *
 * const result = await useGet<{ name: string }>("pokeapi", "pokemonById", {
 *   params: { id: 25 },
 * });
 * ```
 */
export declare function useGet<T = unknown>(apiName: string, endpointName: string, urlOptions?: UrlOptions): Promise<FetchResult<T>>;
/**
 * GET helper over a registered API endpoint.
 * Alias for {@link useGet}.
 *
 * @param apiName - The registered API key.
 * @param endpointName - The endpoint key within the API.
 * @param urlOptions - Optional URL building options.
 * @returns A {@link FetchResult} with data or error.
 *
 * @example
 * ```ts
 * import { useGetApi } from "katanakit-js";
 *
 * const result = await useGetApi<{ name: string }>("pokeapi", "pokemonById", {
 *   params: { id: 25 },
 * });
 * ```
 */
export declare function useGetApi<T = unknown>(apiName: string, endpointName: string, urlOptions?: UrlOptions): Promise<FetchResult<T>>;
/**
 * POST helper over a registered API endpoint.
 *
 * @param apiName - The registered API key.
 * @param endpointName - The endpoint key within the API.
 * @param body - Optional request body (auto-serialized to JSON unless raw).
 * @param urlOptions - Optional URL building options.
 * @returns A {@link FetchResult} with data or error.
 *
 * @example
 * ```ts
 * import { usePost } from "katanakit-js";
 *
 * const result = await usePost("pokeapi", "createPokemon", { name: "Pikachu" });
 * ```
 */
export declare function usePost<T = unknown>(apiName: string, endpointName: string, body?: unknown, urlOptions?: UrlOptions): Promise<FetchResult<T>>;
/**
 * PUT helper over a registered API endpoint.
 *
 * @param apiName - The registered API key.
 * @param endpointName - The endpoint key within the API.
 * @param body - Optional request body (auto-serialized to JSON unless raw).
 * @param urlOptions - Optional URL building options.
 * @returns A {@link FetchResult} with data or error.
 *
 * @example
 * ```ts
 * import { usePut } from "katanakit-js";
 *
 * const result = await usePut("pokeapi", "updatePokemon", { name: "Raichu" }, { params: { id: 25 } });
 * ```
 */
export declare function usePut<T = unknown>(apiName: string, endpointName: string, body?: unknown, urlOptions?: UrlOptions): Promise<FetchResult<T>>;
/**
 * PATCH helper over a registered API endpoint.
 *
 * @param apiName - The registered API key.
 * @param endpointName - The endpoint key within the API.
 * @param body - Optional request body (auto-serialized to JSON unless raw).
 * @param urlOptions - Optional URL building options.
 * @returns A {@link FetchResult} with data or error.
 *
 * @example
 * ```ts
 * import { usePatch } from "katanakit-js";
 *
 * const result = await usePatch("pokeapi", "updatePokemon", { name: "Raichu" }, { params: { id: 25 } });
 * ```
 */
export declare function usePatch<T = unknown>(apiName: string, endpointName: string, body?: unknown, urlOptions?: UrlOptions): Promise<FetchResult<T>>;
/**
 * DELETE helper over a registered API endpoint.
 *
 * @param apiName - The registered API key.
 * @param endpointName - The endpoint key within the API.
 * @param urlOptions - Optional URL building options.
 * @returns A {@link FetchResult} with data or error.
 *
 * @example
 * ```ts
 * import { useDelete } from "katanakit-js";
 *
 * const result = await useDelete("pokeapi", "deletePokemon", { params: { id: 25 } });
 * ```
 */
export declare function useDelete<T = unknown>(apiName: string, endpointName: string, urlOptions?: UrlOptions): Promise<FetchResult<T>>;
//# sourceMappingURL=http.service.d.ts.map