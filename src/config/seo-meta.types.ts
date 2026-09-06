/**
 * Slim SEO types: typical HTML meta + Open Graph (Facebook) only.
 * CamelCase keys map to `<title>` / `<meta>` / `<link rel="canonical">`.
 */

export type SeoBooleanable = boolean | "true" | "false" | "" | 0 | 1;

export type SeoArrayable<T> = T | readonly T[];

/** Open Graph image (string URL or object). */
export interface SeoOgImageObject {
	url?: string;
	secureUrl?: string;
	type?: "image/jpeg" | "image/gif" | "image/png" | "image/webp" | "image/avif" | string;
	width?: string | number;
	height?: string | number;
	alt?: string;
}

/** Robots as string or simple object. */
export interface SeoRobotsObject {
	index?: SeoBooleanable;
	follow?: SeoBooleanable;
	noindex?: SeoBooleanable;
	nofollow?: SeoBooleanable;
	none?: SeoBooleanable;
	noarchive?: SeoBooleanable;
	nosnippet?: SeoBooleanable;
}

/** Article Open Graph extensions (`og:type=article`). */
export interface SeoMetaArticle {
	articleAuthor?: readonly string[];
	articleModifiedTime?: string;
	articlePublishedTime?: string;
	articleSection?: string;
	articleTag?: readonly string[];
}

/**
 * Flat meta: HTML head essentials + Facebook Open Graph.
 */
export interface SeoMetaFlat extends SeoMetaArticle {
	/** Document `<title>`. */
	title?: string;
	/** Meta description. */
	description?: string;
	/** Meta keywords (legacy; optional). */
	keywords?: string;
	/** Meta author. */
	author?: string;
	/** `<link rel="canonical">`. */
	canonical?: string;
	/** Absolute page URL (feeds og:url / canonical defaults). */
	url?: string;
	charset?: "utf-8" | string;
	viewport?: string | Record<string, string | number | undefined>;
	robots?: "noindex, nofollow" | "index, follow" | string | SeoRobotsObject;

	/** Open Graph */
	ogUrl?: string;
	ogTitle?: string;
	ogDescription?: string;
	ogType?: "website" | "article" | "profile" | string;
	ogLocale?: string;
	ogSiteName?: string;
	ogImage?: string | SeoArrayable<SeoOgImageObject>;
	ogImageUrl?: string;
	ogImageSecureUrl?: string;
	ogImageType?: string;
	ogImageWidth?: string | number;
	ogImageHeight?: string | number;
	ogImageAlt?: string;
}

/** Flat meta input (all keys optional / nullable). */
export type SeoMetaInput = {
	[K in keyof SeoMetaFlat]?: SeoMetaFlat[K] | null;
};

/** Site + HTML + OG fields in one object (before Omit). */
export type UseSeoMetaBase = SeoMetaInput & {
	/** Base URL of the site (no trailing slash). */
	site?: string;
	/**
	 * Site brand (SiteConfig.title / og:site_name).
	 * Distinct from page `title`.
	 */
	siteTitle?: string;
	lang?: string;
	rss?: Partial<{
		enabled: boolean;
		path: string;
		title?: string;
		description?: string;
		limit: number;
	}>;
	seo?: Partial<{
		noindex: boolean;
		canonical: boolean;
		openGraph: boolean;
		jsonLd: boolean;
	}>;
	nav?: Array<{ label: string; href: string; external?: boolean }>;
};

/**
 * Public options for {@link useSeoMeta}.
 * Only HTML + Open Graph (+ site fields). Omit keys you do not want in the type:
 *
 * @example
 * ```ts
 * useSeoMeta({ title: "Home", ogImage: "/og.png" } satisfies UseSeoMetaOptions);
 * useSeoMeta({ title: "Home" } as UseSeoMetaOptions<"rss" | "nav">);
 * ```
 */
export type UseSeoMetaOptions<OmitKeys extends keyof UseSeoMetaBase = never> = Omit<
	UseSeoMetaBase,
	OmitKeys
>;

/**
 * Legacy page meta. Prefer {@link UseSeoMetaOptions}.
 * @deprecated
 */
export interface SeoMeta {
	title: string;
	description?: string;
	canonical?: string;
	url?: string;
	ogImage?: string;
	ogType?: "website" | "article" | "profile";
	publishedTime?: string;
	modifiedTime?: string;
	author?: string;
	tags?: string[];
	noindex?: boolean;
}

export interface SeoTagNode {
	tag: "title" | "meta" | "link" | "script";
	attrs?: Record<string, string>;
	text?: string;
}
