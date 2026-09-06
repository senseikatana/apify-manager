import type { SiteConfig } from "./site.config.js";

/**
 * SEO meta tag configuration for a single page.
 */
export interface SeoMeta {
	/** Page title (will be suffixed with site title). */
	title: string;
	/** Page description (falls back to site description). */
	description?: string;
	/** Canonical URL (absolute). If omitted, derived from `url`. */
	canonical?: string;
	/** Page URL (absolute, e.g. "https://example.com/blog/post/"). */
	url?: string;
	/** OG image URL (absolute). Falls back to site config. */
	ogImage?: string;
	/** Content type: "website" | "article" | "profile" (default: "website"). */
	ogType?: "website" | "article" | "profile";
	/** Article published date (ISO string, for og:type=article). */
	publishedTime?: string;
	/** Article modified date (ISO string, for og:type=article). */
	modifiedTime?: string;
	/** Article author (for og:type=article). */
	author?: string;
	/** Article tags (for og:type=article). */
	tags?: string[];
	/** Whether to add noindex (default: false). */
	noindex?: boolean;
}

/**
 * Generates all `<head>` meta tags for SEO, Open Graph, Twitter Card,
 * canonical URL, and JSON-LD structured data.
 *
 * @param config - Site-wide configuration.
 * @param meta - Page-specific meta.
 * @returns HTML string of meta tags to inject in `<head>`.
 *
 * @example
 * ```astro
 * ---
 * import { siteConfig } from "@/config/site.config";
 * import { useGenerateMetaTags } from "@/config/seo.service";
 *
 * const metaTags = useGenerateMetaTags(siteConfig, {
 *   title: "My Blog Post",
 *   description: "A great post about TypeScript",
 *   url: "https://example.com/blog/my-post/",
 *   ogType: "article",
 *   publishedTime: "2024-01-15T00:00:00Z",
 * });
 * ---
 * <head>
 *   <Fragment set:html={metaTags} />
 * </head>
 * ```
 */
export function useGenerateMetaTags(config: SiteConfig, meta: SeoMeta): string {
	const tags: string[] = [];

	const fullTitle = meta.title === config.title ? config.title : `${meta.title} | ${config.title}`;

	const description = meta.description ?? config.description;
	const url = meta.url ?? config.site;
	const ogImage = meta.ogImage ?? config.ogImage;
	const ogImageUrl = ogImage
		? ogImage.startsWith("http")
			? ogImage
			: `${config.site}${ogImage}`
		: undefined;

	// Basic meta tags.
	tags.push(`<title>${escapeHtml(fullTitle)}</title>`);
	tags.push(`<meta name="description" content="${escapeAttr(description)}" />`);

	if (config.author) {
		tags.push(`<meta name="author" content="${escapeAttr(config.author)}" />`);
	}

	// Canonical URL.
	if (config.seo.canonical && url) {
		const canonical = meta.canonical ?? url;
		tags.push(`<link rel="canonical" href="${escapeAttr(canonical)}" />`);
	}

	// Noindex.
	if (meta.noindex || config.seo.noindex) {
		tags.push('<meta name="robots" content="noindex, nofollow" />');
	}

	// Open Graph.
	if (config.seo.openGraph) {
		tags.push(`<meta property="og:type" content="${meta.ogType ?? "website"}" />`);
		tags.push(`<meta property="og:title" content="${escapeAttr(fullTitle)}" />`);
		tags.push(`<meta property="og:description" content="${escapeAttr(description)}" />`);
		tags.push(`<meta property="og:site_name" content="${escapeAttr(config.title)}" />`);
		tags.push(`<meta property="og:locale" content="${escapeAttr(config.lang.replace("-", "_"))}" />`);

		if (url) {
			tags.push(`<meta property="og:url" content="${escapeAttr(url)}" />`);
		}
		if (ogImageUrl) {
			tags.push(`<meta property="og:image" content="${escapeAttr(ogImageUrl)}" />`);
			tags.push(`<meta property="og:image:alt" content="${escapeAttr(fullTitle)}" />`);
		}

		// Article-specific OG tags.
		if (meta.ogType === "article") {
			if (meta.publishedTime) {
				tags.push(
					`<meta property="article:published_time" content="${escapeAttr(meta.publishedTime)}" />`,
				);
			}
			if (meta.modifiedTime) {
				tags.push(
					`<meta property="article:modified_time" content="${escapeAttr(meta.modifiedTime)}" />`,
				);
			}
			if (meta.author) {
				tags.push(`<meta property="article:author" content="${escapeAttr(meta.author)}" />`);
			}
			if (meta.tags) {
				for (const tag of meta.tags) {
					tags.push(`<meta property="article:tag" content="${escapeAttr(tag)}" />`);
				}
			}
		}
	}

	// Twitter Card.
	if (config.seo.twitterCard) {
		tags.push('<meta name="twitter:card" content="summary_large_image" />');
		tags.push(`<meta name="twitter:title" content="${escapeAttr(fullTitle)}" />`);
		tags.push(`<meta name="twitter:description" content="${escapeAttr(description)}" />`);

		if (config.twitter) {
			tags.push(`<meta name="twitter:site" content="@${escapeAttr(config.twitter)}" />`);
			tags.push(`<meta name="twitter:creator" content="@${escapeAttr(config.twitter)}" />`);
		}
		if (ogImageUrl) {
			tags.push(`<meta name="twitter:image" content="${escapeAttr(ogImageUrl)}" />`);
		}
	}

	// JSON-LD structured data.
	if (config.seo.jsonLd) {
		const jsonLd = buildJsonLd(config, meta);
		// Escape <, >, & to prevent XSS via </script> breakout.
		const safeJson = JSON.stringify(jsonLd)
			.replace(/</g, "\\u003c")
			.replace(/>/g, "\\u003e")
			.replace(/&/g, "\\u0026");
		tags.push(`<script type="application/ld+json">${safeJson}</script>`);
	}

	return tags.join("\n");
}

/**
 * Generates a `<title>` tag string.
 */
export function useTitle(config: SiteConfig, pageTitle?: string): string {
	if (!pageTitle || pageTitle === config.title) {
		return `<title>${escapeHtml(config.title)}</title>`;
	}
	return `<title>${escapeHtml(`${pageTitle} | ${config.title}`)}</title>`;
}

/**
 * Generates the RSS `<link>` tag for the `<head>`.
 */
export function useRssHeadLink(config: SiteConfig): string {
	if (!config.rss.enabled) return "";
	const path = config.rss.path ?? "/rss.xml";
	const title = config.rss.title ?? config.title;
	return `<link rel="alternate" type="application/rss+xml" title="${escapeAttr(title)}" href="${escapeAttr(path)}" />`;
}

/**
 * Generates all default `<head>` meta tags for a page (title, description,
 * canonical, OG, Twitter, JSON-LD, RSS link).
 *
 * Convenience wrapper around `useGenerateMetaTags` + `useRssHeadLink`.
 */
export function useHeadTags(config: SiteConfig, meta: SeoMeta): string {
	const metaTags = useGenerateMetaTags(config, meta);
	const rssLink = useRssHeadLink(config);
	return rssLink ? `${metaTags}\n${rssLink}` : metaTags;
}

/**
 * Resolved SEO payload for Astro layouts (pure, non-reactive).
 *
 * Unlike Nuxt `useSeoMeta` / `useHead`, Astro has no reactive head in
 * `.astro` frontmatter — build this object once and inject `html` into
 * `<head>` (or pass the whole result as Layout props).
 */
export interface SeoTagsResult {
	/** Full `<head>` HTML for `<Fragment set:html={html} />`. */
	html: string;
	/** Resolved document title text (with site suffix when applicable). */
	title: string;
	/** Resolved meta description. */
	description: string;
	/** Absolute page URL used for canonical / Open Graph. */
	url: string;
	/** Absolute OG image URL, if configured. */
	ogImage?: string;
	/** Page-level input meta (handy when forwarding Layout props). */
	meta: SeoMeta;
}

/**
 * Builds SEO tags for Astro from `SiteConfig` + page `SeoMeta`.
 *
 * Pure helper — no Vue/Nuxt reactivity. Call in frontmatter, then either:
 * - inject `html` with `<Fragment set:html={seo.html} />`, or
 * - pass `seo` (or `seo.meta`) into a Layout via props.
 *
 * @param config - Site-wide configuration.
 * @param meta - Page-specific meta.
 * @returns Resolved fields plus the HTML string for `<head>`.
 *
 * @example
 * ```astro
 * ---
 * // src/layouts/Layout.astro
 * import { useSeoTags, type SeoMeta } from "katanakit-js";
 * import { siteConfig } from "../config/site";
 *
 * interface Props extends SeoMeta {}
 * const seo = useSeoTags(siteConfig, {
 *   title: Astro.props.title,
 *   description: Astro.props.description,
 *   url: Astro.props.url ?? Astro.url.href,
 *   ogType: Astro.props.ogType,
 * });
 * ---
 * <!doctype html>
 * <html lang={siteConfig.lang}>
 *   <head>
 *     <meta charset="utf-8" />
 *     <Fragment set:html={seo.html} />
 *   </head>
 *   <body>
 *     <slot />
 *   </body>
 * </html>
 * ```
 *
 * @example
 * ```astro
 * ---
 * // src/pages/blog/[slug].astro — pass meta into the layout
 * import Layout from "../../layouts/Layout.astro";
 * import { useSeoTags } from "katanakit-js";
 * import { siteConfig } from "../../config/site";
 *
 * const { post } = Astro.props;
 * const seo = useSeoTags(siteConfig, {
 *   title: post.data.title,
 *   description: post.data.description,
 *   url: new URL(`/blog/${post.slug}/`, siteConfig.site).href,
 *   ogType: "article",
 *   publishedTime: post.data.date.toISOString(),
 * });
 * ---
 * <Layout title={seo.meta.title} description={seo.meta.description} url={seo.url} ogType="article">
 *   <article set:html={post.body} />
 * </Layout>
 * ```
 */
export function useSeoTags(config: SiteConfig, meta: SeoMeta): SeoTagsResult {
	const title = meta.title === config.title ? config.title : `${meta.title} | ${config.title}`;
	const description = meta.description ?? config.description;
	const url = meta.url ?? config.site;
	const ogImageRaw = meta.ogImage ?? config.ogImage;
	const ogImage = ogImageRaw
		? ogImageRaw.startsWith("http")
			? ogImageRaw
			: `${config.site}${ogImageRaw}`
		: undefined;

	return {
		html: useHeadTags(config, meta),
		title,
		description,
		url,
		ogImage,
		meta,
	};
}

// --- Internal helpers ---

function escapeHtml(text: string): string {
	return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttr(text: string): string {
	return text
		.replace(/&/g, "&amp;")
		.replace(/"/g, "&quot;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
}

function buildJsonLd(config: SiteConfig, meta: SeoMeta): Record<string, unknown> {
	const url = meta.url ?? config.site;

	if (meta.ogType === "article") {
		return {
			"@context": "https://schema.org",
			"@type": "Article",
			headline: meta.title,
			description: meta.description ?? config.description,
			url,
			author: {
				"@type": "Person",
				name: meta.author ?? config.author,
			},
			publisher: {
				"@type": "Organization",
				name: config.title,
			},
			datePublished: meta.publishedTime,
			dateModified: meta.modifiedTime ?? meta.publishedTime,
			image: meta.ogImage ?? config.ogImage,
			mainEntityOfPage: {
				"@type": "WebPage",
				"@id": url,
			},
		};
	}

	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: config.title,
		description: config.description,
		url: config.site,
		author: {
			"@type": "Person",
			name: config.author,
		},
	};
}
