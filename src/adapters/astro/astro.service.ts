import type {
	AstroPath,
	AstroServiceResult,
	CollectionEntryLike,
	IAstroService,
	PaginationProps,
	PathsOptions,
} from "../../types/index.js";

/** Convierte una colección en rutas compatibles con `getStaticPaths` de Astro.
 * En un caso real, úsala para generar rutas desde posts, productos o páginas.
 */
export function usePathsFrom<T, TParam extends string = "slug", TProps = T>(
	items: T[],
	options: PathsOptions<T, TParam, TProps> = {},
): AstroPath<TParam, TProps>[] {
	const {
		param = "slug" as TParam,
		valueFrom = (item: T) => {
			const record = item as { slug?: string; id?: string } | null | undefined;
			return record?.slug ?? record?.id ?? "";
		},
		propsFrom = (item: T) => item as unknown as TProps,
		paramsFrom,
	} = options;

	return items.map((item) => ({
		params: (paramsFrom ? paramsFrom(item) : { [param]: String(valueFrom(item)) }) as Record<
			TParam,
			string | undefined
		>,
		props: propsFrom(item),
	}));
}

/** Obtiene una colección y la transforma en rutas seguras para Astro.
 * Por ejemplo, puede usarse dentro de `getStaticPaths` para manejar errores sin lanzar excepciones.
 */
export async function useGetStaticPaths<
	TData = unknown,
	TParam extends string = "slug",
	TProps = CollectionEntryLike<TData>,
>(
	getCollectionFn: (collection: string) => Promise<CollectionEntryLike<TData>[]>,
	collectionName: string,
	options: PathsOptions<CollectionEntryLike<TData>, TParam, TProps> = {},
): Promise<AstroServiceResult<AstroPath<TParam, TProps>[]>> {
	try {
		const entries = await getCollectionFn(collectionName);
		return { data: usePathsFrom(entries, options), error: null, ok: true };
	} catch (error: unknown) {
		return {
			data: null,
			error: {
				message: `Error generating routes for collection "${collectionName}"`,
				collectionName,
				details: error instanceof Error ? error.message : String(error),
			},
			ok: false,
		};
	}
}

/** Busca una entrada por su clave o por `slug`/`id`.
 * Es útil para resolver una página dinámica a partir del parámetro de la URL.
 */
export function useFindEntry<T>(
	items: T[],
	value: string,
	keyFrom?: (item: T) => string | number,
): T | null {
	const getKey =
		keyFrom ??
		((item: T) => {
			const record = item as { slug?: string; id?: string } | null | undefined;
			return record?.slug ?? record?.id ?? "";
		});
	return items.find((item) => String(getKey(item)) === value) ?? null;
}

/** Genera las rutas y propiedades de cada página de una lista paginada.
 * Úsala para crear páginas `/page/2`, `/page/3`, etc., conservando la primera como ruta raíz.
 */
export function useGeneratePagination<T, TParam extends string = "page">(
	items: T[],
	pageSize = 10,
	param: TParam = "page" as TParam,
): AstroPath<TParam, PaginationProps<T>>[] {
	const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
	return Array.from({ length: totalPages }, (_, i) => {
		const currentPage = i + 1;
		return {
			params: { [param]: currentPage === 1 ? undefined : String(currentPage) } as Record<
				TParam,
				string | undefined
			>,
			props: { items: items.slice(i * pageSize, (i + 1) * pageSize), currentPage, totalPages },
		};
	});
}

/** Convierte valores simples en rutas Astro.
 * Por ejemplo, transforma una lista de categorías en rutas `/category/:slug`.
 */
export function usePathsFromValues<TParam extends string = "slug">(
	values: (string | number)[],
	param: TParam = "slug" as TParam,
): AstroPath<TParam, string | number>[] {
	return values.map((value) => ({
		params: { [param]: String(value) } as Record<TParam, string | undefined>,
		props: value,
	}));
}

/** Extrae valores únicos, admitiendo claves simples o arrays.
 * Es útil para construir filtros, taxonomías o rutas a partir de una colección.
 */
export function useExtractUniqueValues<T, V>(items: T[], keyFrom: (item: T) => V | V[]): V[] {
	return [...new Set(items.flatMap(keyFrom))];
}

/** Fachada singleton compatible con la API orientada a objetos anterior. */
export class AstroService implements IAstroService {
	private static instance: AstroService;

	private constructor() {}

	public static getInstance(): AstroService {
		if (!AstroService.instance) {
			AstroService.instance = new AstroService();
		}
		return AstroService.instance;
	}

	public usePathsFrom = usePathsFrom;

	public useGetStaticPaths = async <
		TData = unknown,
		TParam extends string = "slug",
		TProps = CollectionEntryLike<TData>,
	>(
		getCollectionFn: (collection: string) => Promise<CollectionEntryLike<TData>[]>,
		collectionName: string,
		options: PathsOptions<CollectionEntryLike<TData>, TParam, TProps> = {},
	): Promise<AstroServiceResult<AstroPath<TParam, TProps>[]>> =>
		useGetStaticPaths(getCollectionFn, collectionName, options);

	public useFindEntry = <T>(
		items: T[],
		value: string,
		keyFrom?: (item: T) => string | number,
	): T | null => useFindEntry(items, value, keyFrom);

	public useGeneratePagination = <T, TParam extends string = "page">(
		items: T[],
		pageSize = 10,
		param: TParam = "page" as TParam,
	): AstroPath<TParam, PaginationProps<T>>[] => useGeneratePagination(items, pageSize, param);

	public usePathsFromValues = <TParam extends string = "slug">(
		values: (string | number)[],
		param: TParam = "slug" as TParam,
	): AstroPath<TParam, string | number>[] => usePathsFromValues(values, param);

	public useExtractUniqueValues = useExtractUniqueValues;
}

// Singleton instance and destructured exports.
export const astroService: AstroService = AstroService.getInstance();
