import type { FetchResult } from "../../types/index.js";
/**
 * Unwraps a KatanaKit Safe Result, throwing an H3-compatible error on failure.
 * Returns the data directly on success.
 *
 * Prefers `h3.createError` when available so Nuxt/H3 status codes work correctly.
 *
 * @param result - The Safe Result from `useFetch`, `useGet`, `usePost`, etc.
 * @param context - Optional context prefix for the error message.
 * @returns The data from the result.
 * @throws H3-compatible error with the appropriate status code.
 *
 * @example
 * ```ts
 * // server/api/pokemon/[id].ts
 * import { useGetApi } from "katanakit-js";
 * import { useUnwrap } from "katanakit-js/adapters/nuxt";
 *
 * export default defineEventHandler(async (event) => {
 *   const id = getRouterParam(event, "id");
 *   const result = await useGetApi("pokeapi", "pokemonById", { params: { id } });
 *   return useUnwrap(result, `Pokemon ${id}`);
 * });
 * ```
 */
export declare function useUnwrap<T>(result: FetchResult<T>, context?: string): T;
/**
 * Creates a Safe Result response for Nuxt API routes.
 * Returns the data with proper status code on success,
 * or an error response on failure.
 *
 * @param result - The Safe Result from any KatanaKit fetch method.
 * @returns An H3-compatible response object.
 *
 * @example
 * ```ts
 * // server/api/users.ts
 * import { useGetApi } from "katanakit-js";
 * import { useSafeResponse } from "katanakit-js/adapters/nuxt";
 *
 * export default defineEventHandler(async () => {
 *   const result = await useGetApi("api", "users");
 *   return useSafeResponse(result);
 * });
 * ```
 */
export declare function useSafeResponse<T>(result: FetchResult<T>): {
    data: T | null;
    error: {
        message: string;
        status: number;
    } | null;
    ok: boolean;
};
/**
 * Maps a KatanaKit Safe Result to an H3 event response.
 * Sets the appropriate status code and returns the data or error.
 *
 * @param event - The H3 event object.
 * @param result - The Safe Result from any KatanaKit fetch method.
 * @returns The data on success.
 *
 * @example
 * ```ts
 * // server/api/products.ts
 * import { useFetchApi } from "katanakit-js";
 * import { useEventResponse } from "katanakit-js/adapters/nuxt";
 *
 * export default defineEventHandler(async (event) => {
 *   const result = await useFetchApi("shop", "products");
 *   return useEventResponse(event, result);
 * });
 * ```
 */
export declare function useEventResponse<T>(event: {
    node: {
        res: {
            statusCode: number;
        };
    };
}, result: FetchResult<T>): T | {
    error: string;
    status: number;
};
//# sourceMappingURL=nuxt.service.d.ts.map