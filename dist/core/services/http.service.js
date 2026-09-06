/**
 * Framework-agnostic HTTP client: builds safe URLs from a JSON-defined registry
 * and wraps `fetch` in a Safe Result. Implemented as a Facade + Singleton.
 */
export class FetchApiManager {
    static instance;
    apis = {};
    constructor() { }
    static getInstance() {
        if (!FetchApiManager.instance) {
            FetchApiManager.instance = new FetchApiManager();
        }
        return FetchApiManager.instance;
    }
    /**
     * Registers (merges) API definitions into the client registry.
     * Prefer the clearer alias {@link useInitApis}.
     */
    useInit = (apis) => {
        this.apis = { ...this.apis, ...apis };
    };
    /**
     * Registers (merges) API definitions into the client registry.
     */
    useInitApis = (apis) => {
        this.useInit(apis);
    };
    /**
     * Returns a shallow copy of the registered APIs (safe to mutate locally).
     */
    useGetApis = () => ({ ...this.apis });
    /**
     * Alias for {@link useGetApis}.
     */
    useGetApisConfig = () => this.useGetApis();
    GET_API_ENTRY = (apiName) => {
        const api = this.apis[apiName];
        if (!api) {
            throw new Error(`[FetchApiManager] API "${apiName}" is not registered.`);
        }
        return api;
    };
    useBuildUrl = (apiName, endpointName, options = {}) => {
        const { params, query, ignoreDefaultQuery = false } = options;
        const api = this.GET_API_ENTRY(apiName);
        let path = api.endpoints?.[endpointName] ?? "";
        if (!path) {
            throw new Error(`[FetchApiManager] Endpoint "${endpointName}" not found in API "${apiName}".`);
        }
        if (params) {
            const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            path = Object.entries(params).reduce((acc, [key, value]) => acc.replace(new RegExp(`:${escapeRegex(key)}\\b`, "g"), encodeURIComponent(String(value))), path);
        }
        const baseStr = api.baseUri instanceof URL ? api.baseUri.toString() : api.baseUri;
        const baseClean = baseStr.endsWith("/") ? baseStr.slice(0, -1) : baseStr;
        const pathClean = path.startsWith("/") ? path : `/${path}`;
        const url = new URL(`${baseClean}${pathClean}`);
        // Only allow http(s) to prevent SSRF and `javascript:` URLs.
        if (url.protocol !== "http:" && url.protocol !== "https:") {
            throw new Error(`[FetchApiManager] Scheme "${url.protocol}" is not allowed.`);
        }
        const defaultParams = ignoreDefaultQuery ? {} : (api.defaultQueryParams?.[endpointName] ?? {});
        const mergedQuery = { ...defaultParams, ...query };
        for (const [key, value] of Object.entries(mergedQuery)) {
            if (value !== undefined && value !== null) {
                url.searchParams.set(key, String(value));
            }
        }
        return url.toString();
    };
    /**
     * Alias for {@link useBuildUrl}.
     */
    useBuildApiUrl = (apiName, endpointName, options = {}) => this.useBuildUrl(apiName, endpointName, options);
    READ_BODY = async (response) => {
        const text = await response.text();
        if (!text)
            return null;
        const contentType = response.headers.get("content-type") ?? "";
        if (contentType.includes("application/json")) {
            try {
                return JSON.parse(text);
            }
            catch {
                return text;
            }
        }
        try {
            return JSON.parse(text);
        }
        catch {
            return text;
        }
    };
    useFetch = async (apiName, endpointName, { urlOptions, ...init } = {}) => {
        let url = "";
        try {
            url = this.useBuildUrl(apiName, endpointName, urlOptions);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return {
                data: null,
                error: {
                    message: `Config Error: ${message}`,
                    status: 0,
                },
                url,
                status: 0,
                ok: false,
            };
        }
        try {
            const response = await fetch(url, init);
            if (!response.ok) {
                const errorDetails = await this.READ_BODY(response);
                return {
                    data: null,
                    error: {
                        message: `HTTP Error: ${response.statusText || "Unsuccessful response"}`,
                        status: response.status,
                        details: errorDetails,
                    },
                    url: response.url || url,
                    status: response.status,
                    ok: false,
                };
            }
            // 204 No Content and empty bodies are valid success responses.
            if (response.status === 204) {
                return {
                    data: null,
                    error: null,
                    url: response.url || url,
                    status: 204,
                    ok: true,
                };
            }
            const body = await this.READ_BODY(response);
            return {
                data: body,
                error: null,
                url: response.url || url,
                status: response.status,
                ok: true,
            };
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return {
                data: null,
                error: {
                    message: `Network/Client Error: ${message}`,
                    status: 0,
                },
                url,
                status: 0,
                ok: false,
            };
        }
    };
    /**
     * Alias for {@link useFetch}.
     */
    useFetchApi = async (apiName, endpointName, options) => this.useFetch(apiName, endpointName, options);
    useGet = async (apiName, endpointName, urlOptions) => this.useFetch(apiName, endpointName, { method: "GET", urlOptions });
    /**
     * Alias for {@link useGet}.
     */
    useGetApi = async (apiName, endpointName, urlOptions) => this.useGet(apiName, endpointName, urlOptions);
    usePost = async (apiName, endpointName, body, urlOptions) => this.useFetch(apiName, endpointName, {
        method: "POST",
        ...this.SERIALIZE_BODY(body),
        urlOptions,
    });
    usePut = async (apiName, endpointName, body, urlOptions) => this.useFetch(apiName, endpointName, {
        method: "PUT",
        ...this.SERIALIZE_BODY(body),
        urlOptions,
    });
    usePatch = async (apiName, endpointName, body, urlOptions) => this.useFetch(apiName, endpointName, {
        method: "PATCH",
        ...this.SERIALIZE_BODY(body),
        urlOptions,
    });
    useDelete = async (apiName, endpointName, urlOptions) => this.useFetch(apiName, endpointName, {
        method: "DELETE",
        urlOptions,
    });
    /**
     * Serializes a request body: leaves FormData / Blob / URLSearchParams /
     * ArrayBuffer / TypedArray / ReadableStream untouched (no forced JSON
     * Content-Type so the runtime can set the multipart boundary).
     */
    SERIALIZE_BODY = (body) => {
        if (body === undefined)
            return {};
        const isRawBody = (typeof FormData !== "undefined" && body instanceof FormData) ||
            (typeof Blob !== "undefined" && body instanceof Blob) ||
            (typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams) ||
            (typeof ArrayBuffer !== "undefined" && body instanceof ArrayBuffer) ||
            ArrayBuffer.isView(body) ||
            (typeof ReadableStream !== "undefined" && body instanceof ReadableStream) ||
            typeof body === "string";
        if (isRawBody) {
            return { body: body };
        }
        return {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        };
    };
}
const http = FetchApiManager.getInstance();
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
export function useInitApis(apis) {
    http.useInitApis(apis);
}
/**
 * @deprecated Use {@link useInitApis} for a clearer name.
 */
export function useInit(apis) {
    http.useInit(apis);
}
/**
 * Returns a shallow copy of the registered APIs.
 *
 * @example
 * ```ts
 * import { useGetApisConfig } from "katanakit-js";
 * const apis = useGetApisConfig();
 * ```
 */
export function useGetApisConfig() {
    return http.useGetApisConfig();
}
/**
 * @deprecated Prefer {@link useGetApisConfig}.
 */
export function useGetApis() {
    return http.useGetApis();
}
/**
 * Builds a safe http(s) URL from a registered API + endpoint.
 *
 * @example
 * ```ts
 * import { useBuildApiUrl } from "katanakit-js";
 * const url = useBuildApiUrl("pokeapi", "pokemonById", { params: { id: 25 } });
 * ```
 */
export function useBuildApiUrl(apiName, endpointName, options) {
    return http.useBuildApiUrl(apiName, endpointName, options);
}
/**
 * @deprecated Prefer {@link useBuildApiUrl}.
 */
export function useBuildUrl(apiName, endpointName, options) {
    return http.useBuildUrl(apiName, endpointName, options);
}
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
export function useFetchApi(apiName, endpointName, options) {
    return http.useFetchApi(apiName, endpointName, options);
}
/**
 * @deprecated Prefer {@link useFetchApi}.
 */
export function useFetch(apiName, endpointName, options) {
    return http.useFetch(apiName, endpointName, options);
}
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
export function useGetApi(apiName, endpointName, urlOptions) {
    return http.useGetApi(apiName, endpointName, urlOptions);
}
/**
 * @deprecated Prefer {@link useGetApi}.
 */
export function useGet(apiName, endpointName, urlOptions) {
    return http.useGet(apiName, endpointName, urlOptions);
}
/** POST helper over a registered API endpoint. */
export function usePost(apiName, endpointName, body, urlOptions) {
    return http.usePost(apiName, endpointName, body, urlOptions);
}
/** PUT helper over a registered API endpoint. */
export function usePut(apiName, endpointName, body, urlOptions) {
    return http.usePut(apiName, endpointName, body, urlOptions);
}
/** PATCH helper over a registered API endpoint. */
export function usePatch(apiName, endpointName, body, urlOptions) {
    return http.usePatch(apiName, endpointName, body, urlOptions);
}
/** DELETE helper over a registered API endpoint. */
export function useDelete(apiName, endpointName, urlOptions) {
    return http.useDelete(apiName, endpointName, urlOptions);
}
//# sourceMappingURL=http.service.js.map