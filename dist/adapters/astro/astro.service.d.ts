import type { AstroPath, AstroServiceResult, CollectionEntryLike, PaginationProps, PathsOptions } from "../../types/index.js";
/**
 * Convert a collection into Astro-compatible static paths.
 *
 * @param items - Collection items to convert
 * @param options - Configuration for param name, value extraction and props
 * @returns Array of Astro paths with params and props
 *
 * @example
 * ```ts
 * // In Astro's getStaticPaths()
 * const posts = await getCollection("blog");
 * const paths = useAstroPathsFrom(posts, {
 *   param: "slug",
 *   valueFrom: (post) => post.slug,
 *   propsFrom: (post) => ({ title: post.data.title }),
 * });
 * // [{ params: { slug: "hello-world" }, props: { title: "Hello World" } }]
 * ```
 */
export declare function useAstroPathsFrom<T, TParam extends string = "slug", TProps = T>(items: T[], options?: PathsOptions<T, TParam, TProps>): AstroPath<TParam, TProps>[];
/**
 * Fetch a collection and transform it into safe Astro paths.
 * Returns a result object instead of throwing on error.
 *
 * @param getCollectionFn - Astro's getCollection function
 * @param collectionName - Name of the collection to fetch
 * @param options - Path generation options
 * @returns Safe result with data or error
 *
 * @example
 * ```ts
 * export async function getStaticPaths() {
 *   const result = await useAstroGetStaticPaths(getCollection, "blog");
 *   if (result.ok) return result.data;
 *   TODO: traer el useLogger('error', result.error)
 *   console.error(result.error);
 *   return [];
 * }
 * ```
 */
export declare function useAstroGetStaticPaths<TData = unknown, TParam extends string = "slug", TProps = CollectionEntryLike<TData>>(getCollectionFn: (collection: string) => Promise<CollectionEntryLike<TData>[]>, collectionName: string, options?: PathsOptions<CollectionEntryLike<TData>, TParam, TProps>): Promise<AstroServiceResult<AstroPath<TParam, TProps>[]>>;
/**
 * Find a collection entry by slug or custom key.
 *
 * @param items - Collection items to search
 * @param value - Value to match (slug, id, etc.)
 * @param keyFrom - Optional function to extract the key from an item
 * @returns Matched item or null
 *
 * @example
 * ```ts
 * const posts = await getCollection("blog");
 * const post = useAstroFindEntry(posts, "hello-world");
 * if (post) console.log(post.data.title);
 * ```
 */
export declare function useAstroFindEntry<T>(items: T[], value: string, keyFrom?: (item: T) => string | number): T | null;
/**
 * Generate paginated Astro paths from a list of items.
 *
 * @param items - Items to paginate
 * @param pageSize - Number of items per page
 * @param param - URL param name for page number
 * @returns Array of Astro paths with pagination props
 *
 * @example
 * ```ts
 * const posts = await getCollection("blog");
 * const pages = useAstroGeneratePagination(posts, 10);
 * // [{ params: { page: undefined }, props: { items: [...], currentPage: 1, totalPages: 3 } },
 * //  { params: { page: "2" }, props: { items: [...], currentPage: 2, totalPages: 3 } }, ...]
 * ```
 */
export declare function useAstroGeneratePagination<T, TParam extends string = "page">(items: T[], pageSize?: number, param?: TParam): AstroPath<TParam, PaginationProps<T>>[];
/**
 * Convert simple values into Astro paths.
 *
 * @param values - Array of string or number values
 * @param param - URL param name
 * @returns Array of Astro paths
 *
 * @example
 * ```ts
 * const categories = ["tech", "design", "business"];
 * const paths = useAstroPathsFromValues(categories, "category");
 * // [{ params: { category: "tech" }, props: "tech" }, ...]
 * ```
 */
export declare function useAstroPathsFromValues<TParam extends string = "slug">(values: (string | number)[], param?: TParam): AstroPath<TParam, string | number>[];
/**
 * Extract unique values from a collection, supporting single values or arrays.
 *
 * @param items - Collection items
 * @param keyFrom - Function to extract value(s) from each item
 * @returns Array of unique values
 *
 * @example
 * ```ts
 * const posts = [{ tags: ["ts", "react"] }, { tags: ["ts", "vue"] }];
 * const tags = useAstroExtractUniqueValues(posts, (p) => p.tags);
 * // ["ts", "react", "vue"]
 * ```
 */
export declare function useAstroExtractUniqueValues<T, V>(items: T[], keyFrom: (item: T) => V | V[]): V[];
//# sourceMappingURL=astro.service.d.ts.map