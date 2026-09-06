import type {
	ApiEntry,
	ApisConfig,
	FetchOptions,
	FetchResult,
	IFetchApiManager,
	UrlOptions,
} from "../../types/index.js";

/**
 * Framework-agnostic HTTP client: builds safe URLs from a JSON-defined registry
 * and wraps `fetch` in a Safe Result. Implemented as a Facade + Singleton.
 */
export class FetchApiManager implements IFetchApiManager {
	private static instance: FetchApiManager;
	private apis: ApisConfig = {};

	private constructor() {}

	public static getInstance(): FetchApiManager {
		if (!FetchApiManager.instance) {
			FetchApiManager.instance = new FetchApiManager();
		}
		return FetchApiManager.instance;
	}

	/**
	 * Registers (merges) API definitions into the client registry.
	 * Prefer the clearer alias {@link useInitApis}.
	 */
	public useInit = (apis: ApisConfig): void => {
		this.apis = { ...this.apis, ...apis };
	};

	/**
	 * Registers (merges) API definitions into the client registry.
	 */
	public useInitApis = (apis: ApisConfig): void => {
		this.useInit(apis);
	};

	/**
	 * Returns a shallow copy of the registered APIs (safe to mutate locally).
	 */
	public useGetApis = (): ApisConfig => ({ ...this.apis });

	/**
	 * Alias for {@link useGetApis}.
	 */
	public useGetApisConfig = (): ApisConfig => this.useGetApis();

	private GET_API_ENTRY = (apiName: string): ApiEntry => {
		const api = this.apis[apiName];
		if (!api) {
			throw new Error(`[FetchApiManager] API "${apiName}" is not registered.`);
		}
		return api;
	};

	public useBuildUrl = (apiName: string, endpointName: string, options: UrlOptions = {}): string => {
		const { params, query, ignoreDefaultQuery = false } = options;
		const api = this.GET_API_ENTRY(apiName);
		let path = api.endpoints?.[endpointName] ?? "";

		if (!path) {
			throw new Error(`[FetchApiManager] Endpoint "${endpointName}" not found in API "${apiName}".`);
		}

		if (params) {
			const escapeRegex = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
			path = Object.entries(params).reduce(
				(acc, [key, value]) =>
					acc.replace(new RegExp(`:${escapeRegex(key)}\\b`, "g"), encodeURIComponent(String(value))),
				path,
			);
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
	public useBuildApiUrl = (
		apiName: string,
		endpointName: string,
		options: UrlOptions = {},
	): string => this.useBuildUrl(apiName, endpointName, options);

	private READ_BODY = async (response: Response): Promise<unknown> => {
		const text = await response.text();
		if (!text) return null;

		const contentType = response.headers.get("content-type") ?? "";
		if (contentType.includes("application/json")) {
			try {
				return JSON.parse(text) as unknown;
			} catch {
				return text;
			}
		}

		try {
			return JSON.parse(text) as unknown;
		} catch {
			return text;
		}
	};

	public useFetch = async <T = unknown>(
		apiName: string,
		endpointName: string,
		{ urlOptions, ...init }: FetchOptions = {},
	): Promise<FetchResult<T>> => {
		let url = "";

		try {
			url = this.useBuildUrl(apiName, endpointName, urlOptions);
		} catch (err: unknown) {
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
					data: null as T,
					error: null,
					url: response.url || url,
					status: 204,
					ok: true,
				};
			}

			const body = await this.READ_BODY(response);

			return {
				data: body as T,
				error: null,
				url: response.url || url,
				status: response.status,
				ok: true,
			};
		} catch (err: unknown) {
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
	public useFetchApi = async <T = unknown>(
		apiName: string,
		endpointName: string,
		options?: FetchOptions,
	): Promise<FetchResult<T>> => this.useFetch<T>(apiName, endpointName, options);

	public useGet = async <T = unknown>(
		apiName: string,
		endpointName: string,
		urlOptions?: UrlOptions,
	): Promise<FetchResult<T>> =>
		this.useFetch<T>(apiName, endpointName, { method: "GET", urlOptions });

	/**
	 * Alias for {@link useGet}.
	 */
	public useGetApi = async <T = unknown>(
		apiName: string,
		endpointName: string,
		urlOptions?: UrlOptions,
	): Promise<FetchResult<T>> => this.useGet<T>(apiName, endpointName, urlOptions);

	public usePost = async <T = unknown>(
		apiName: string,
		endpointName: string,
		body?: unknown,
		urlOptions?: UrlOptions,
	): Promise<FetchResult<T>> =>
		this.useFetch<T>(apiName, endpointName, {
			method: "POST",
			...this.SERIALIZE_BODY(body),
			urlOptions,
		});

	public usePut = async <T = unknown>(
		apiName: string,
		endpointName: string,
		body?: unknown,
		urlOptions?: UrlOptions,
	): Promise<FetchResult<T>> =>
		this.useFetch<T>(apiName, endpointName, {
			method: "PUT",
			...this.SERIALIZE_BODY(body),
			urlOptions,
		});

	public usePatch = async <T = unknown>(
		apiName: string,
		endpointName: string,
		body?: unknown,
		urlOptions?: UrlOptions,
	): Promise<FetchResult<T>> =>
		this.useFetch<T>(apiName, endpointName, {
			method: "PATCH",
			...this.SERIALIZE_BODY(body),
			urlOptions,
		});

	public useDelete = async <T = unknown>(
		apiName: string,
		endpointName: string,
		urlOptions?: UrlOptions,
	): Promise<FetchResult<T>> =>
		this.useFetch<T>(apiName, endpointName, {
			method: "DELETE",
			urlOptions,
		});

	/**
	 * Serializes a request body: leaves FormData / Blob / URLSearchParams /
	 * ArrayBuffer / TypedArray / ReadableStream untouched (no forced JSON
	 * Content-Type so the runtime can set the multipart boundary).
	 */
	private SERIALIZE_BODY = (body: unknown): { body?: BodyInit; headers?: HeadersInit } => {
		if (body === undefined) return {};

		const isRawBody =
			(typeof FormData !== "undefined" && body instanceof FormData) ||
			(typeof Blob !== "undefined" && body instanceof Blob) ||
			(typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams) ||
			(typeof ArrayBuffer !== "undefined" && body instanceof ArrayBuffer) ||
			ArrayBuffer.isView(body) ||
			(typeof ReadableStream !== "undefined" && body instanceof ReadableStream) ||
			typeof body === "string";

		if (isRawBody) {
			return { body: body as BodyInit };
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
export function useInitApis(apis: ApisConfig): void {
	http.useInitApis(apis);
}

/**
 * @deprecated Use {@link useInitApis} for a clearer name.
 */
export function useInit(apis: ApisConfig): void {
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
export function useGetApisConfig(): ApisConfig {
	return http.useGetApisConfig();
}

/**
 * @deprecated Prefer {@link useGetApisConfig}.
 */
export function useGetApis(): ApisConfig {
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
export function useBuildApiUrl(
	apiName: string,
	endpointName: string,
	options?: UrlOptions,
): string {
	return http.useBuildApiUrl(apiName, endpointName, options);
}

/**
 * @deprecated Prefer {@link useBuildApiUrl}.
 */
export function useBuildUrl(apiName: string, endpointName: string, options?: UrlOptions): string {
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
export function useFetchApi<T = unknown>(
	apiName: string,
	endpointName: string,
	options?: FetchOptions,
): Promise<FetchResult<T>> {
	return http.useFetchApi<T>(apiName, endpointName, options);
}

/**
 * @deprecated Prefer {@link useFetchApi}.
 */
export function useFetch<T = unknown>(
	apiName: string,
	endpointName: string,
	options?: FetchOptions,
): Promise<FetchResult<T>> {
	return http.useFetch<T>(apiName, endpointName, options);
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
export function useGetApi<T = unknown>(
	apiName: string,
	endpointName: string,
	urlOptions?: UrlOptions,
): Promise<FetchResult<T>> {
	return http.useGetApi<T>(apiName, endpointName, urlOptions);
}

/**
 * @deprecated Prefer {@link useGetApi}.
 */
export function useGet<T = unknown>(
	apiName: string,
	endpointName: string,
	urlOptions?: UrlOptions,
): Promise<FetchResult<T>> {
	return http.useGet<T>(apiName, endpointName, urlOptions);
}

/** POST helper over a registered API endpoint. */
export function usePost<T = unknown>(
	apiName: string,
	endpointName: string,
	body?: unknown,
	urlOptions?: UrlOptions,
): Promise<FetchResult<T>> {
	return http.usePost<T>(apiName, endpointName, body, urlOptions);
}

/** PUT helper over a registered API endpoint. */
export function usePut<T = unknown>(
	apiName: string,
	endpointName: string,
	body?: unknown,
	urlOptions?: UrlOptions,
): Promise<FetchResult<T>> {
	return http.usePut<T>(apiName, endpointName, body, urlOptions);
}

/** PATCH helper over a registered API endpoint. */
export function usePatch<T = unknown>(
	apiName: string,
	endpointName: string,
	body?: unknown,
	urlOptions?: UrlOptions,
): Promise<FetchResult<T>> {
	return http.usePatch<T>(apiName, endpointName, body, urlOptions);
}

/** DELETE helper over a registered API endpoint. */
export function useDelete<T = unknown>(
	apiName: string,
	endpointName: string,
	urlOptions?: UrlOptions,
): Promise<FetchResult<T>> {
	return http.useDelete<T>(apiName, endpointName, urlOptions);
}
