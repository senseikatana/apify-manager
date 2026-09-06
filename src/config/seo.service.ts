import type { SiteConfig } from "./site.config.js";

/**
 * Page-level SEO input. Framework-agnostic — works with Vanilla, Astro,
 * Vue/React SPAs, Express HTML shells, etc. Prefer Nuxt's built-in
 * `useSeoMeta` / `useHead` inside Nuxt apps.
 */
export interface SeoMeta {
	/** Page title (suffixed with site title when different). */
	title: string;
	/** Page description (falls back to site description). */
	description?: string;
	/** Canonical URL (absolute). If omitted, derived from `url`. */
	canonical?: string;
	/** Absolute page URL (e.g. `"https://example.com/blog/post/"`). */
	url?: string;
	/** OG image URL (absolute or site-relative). Falls back to site config. */
	ogImage?: string;
	/** Content type: `"website"` | `"article"` | `"profile"` (default: `"website"`). */
	ogType?: "website" | "article" | "profile";
	/** Article published date (ISO string, for `og:type=article`). */
	publishedTime?: string;
	/** Article modified date (ISO string, for `og:type=article`). */
	modifiedTime?: string;
	/** Article author (for `og:type=article`). */
	author?: string;
	/** Article tags (for `og:type=article`). */
	tags?: string[];
	/** Whether to add noindex (default: false). */
	noindex?: boolean;
}

/**
 * One `<head>` node as data (safe to map in any framework / Vanilla DOM).
 */
export interface SeoTagNode {
	tag: "title" | "meta" | "link" | "script";
	attrs?: Record<string, string>;
	/** Text content for `<title>` / `<script>`. */
	text?: string;
}

/**
 * Resolved SEO payload from {@link useSeoTag}.
 *
 * - **SSR / Astro / templates:** use `html` (escaped string).
 * - **Vanilla / SPA:** use `tags` + {@link useApplySeoTag}, or map `tags` yourself.
 * - **Any framework:** use `title` / `description` / `url` / `ogImage` as props.
 */
export interface SeoTagResult {
	/** Full `<head>` HTML fragment (escaped). */
	html: string;
	/** Structured nodes for programmatic injection. */
	tags: SeoTagNode[];
	/** Resolved document title text. */
	title: string;
	/** Resolved meta description. */
	description: string;
	/** Absolute page URL used for canonical / Open Graph. */
	url: string;
	/** Absolute OG image URL, if configured. */
	ogImage?: string;
	/** Page-level input meta. */
	meta: SeoMeta;
	/** JSON-LD object when enabled (also embedded in `html` / `tags`). */
	jsonLd?: Record<string, unknown>;
}

/** @deprecated Use {@link SeoTagResult}. */
export type SeoTagsResult = SeoTagResult;

/**
 * Builds a framework-agnostic SEO payload from site config + page meta.
 *
 * Pure function — no DOM, no Vue/Nuxt reactivity. Nuxt apps should use
 * Nuxt's own head APIs; this is for Vanilla, Astro, Vue/React SPAs, Express, etc.
 *
 * @example Vanilla
 * ```ts
 * import { useSeoTag, useApplySeoTag } from "katanakit-js";
 *
 * const seo = useSeoTag(siteConfig, { title: "Home", url: location.href });
 * useApplySeoTag(seo);
 * ```
 *
 * @example Astro Layout
 * ```astro
 * ---
 * import { useSeoTag } from "katanakit-js";
 * const seo = useSeoTag(siteConfig, { title: Astro.props.title, url: Astro.url.href });
 * ---
 * <head><Fragment set:html={seo.html} /></head>
 * ```
 *
 * @example Vue / React (string or nodes)
 * ```ts
 * const seo = useSeoTag(siteConfig, { title: route.meta.title });
 * // put seo.html in index.html shell, or map seo.tags into your head lib
 * document.title = seo.title;
 * ```
 */
export function useSeoTag(config: SiteConfig, meta: SeoMeta): SeoTagResult {
	const resolved = resolveSeoFields(config, meta);
	const tags = buildSeoTagNodes(config, meta, resolved);
	const rss = useRssHeadLink(config);
	if (rss) {
		tags.push(...parseSingleLinkTag(rss));
	}

	return {
		html: serializeSeoTags(tags),
		tags,
		title: resolved.title,
		description: resolved.description,
		url: resolved.url,
		ogImage: resolved.ogImage,
		meta,
		jsonLd: resolved.jsonLd,
	};
}

/**
 * @deprecated Prefer {@link useSeoTag} (same return value).
 */
export const useSeoTags = useSeoTag;

/**
 * Applies {@link SeoTagResult.tags} into a document `<head>` (Vanilla / SPA).
 * No-op when `document` is unavailable (SSR). Replaces prior KatanaKit nodes
 * marked with `data-katanakit-seo`.
 */
export function useApplySeoTag(
	seo: SeoTagResult,
	head: ParentNode | null = typeof document !== "undefined" ? document.head : null,
): void {
	if (!head || typeof document === "undefined") return;

	for (const el of head.querySelectorAll("[data-katanakit-seo]")) {
		el.remove();
	}

	for (const node of seo.tags) {
		const el = document.createElement(node.tag);
		el.setAttribute("data-katanakit-seo", "");
		if (node.attrs) {
			for (const [key, value] of Object.entries(node.attrs)) {
				el.setAttribute(key, value);
			}
		}
		if (node.text !== undefined) {
			el.textContent = node.text;
		}
		head.appendChild(el);
	}
}

/**
 * HTML string of meta tags (no RSS). Prefer {@link useSeoTag} for the full payload.
 */
export function useGenerateMetaTags(config: SiteConfig, meta: SeoMeta): string {
	const resolved = resolveSeoFields(config, meta);
	return serializeSeoTags(buildSeoTagNodes(config, meta, resolved));
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
 * Full `<head>` HTML (meta + RSS). Equivalent to `useSeoTag(config, meta).html`.
 */
export function useHeadTags(config: SiteConfig, meta: SeoMeta): string {
	return useSeoTag(config, meta).html;
}

// --- Internals ---

interface ResolvedSeoFields {
	title: string;
	description: string;
	url: string;
	ogImage?: string;
	jsonLd?: Record<string, unknown>;
}

function resolveSeoFields(config: SiteConfig, meta: SeoMeta): ResolvedSeoFields {
	const title = meta.title === config.title ? config.title : `${meta.title} | ${config.title}`;
	const description = meta.description ?? config.description;
	const url = meta.url ?? config.site;
	const ogImageRaw = meta.ogImage ?? config.ogImage;
	const ogImage = ogImageRaw
		? ogImageRaw.startsWith("http")
			? ogImageRaw
			: `${config.site}${ogImageRaw}`
		: undefined;
	const jsonLd = config.seo.jsonLd ? buildJsonLd(config, meta) : undefined;
	return { title, description, url, ogImage, jsonLd };
}

function buildSeoTagNodes(
	config: SiteConfig,
	meta: SeoMeta,
	resolved: ResolvedSeoFields,
): SeoTagNode[] {
	const tags: SeoTagNode[] = [];
	const { title, description, url, ogImage, jsonLd } = resolved;

	tags.push({ tag: "title", text: title });
	tags.push({ tag: "meta", attrs: { name: "description", content: description } });

	if (config.author) {
		tags.push({ tag: "meta", attrs: { name: "author", content: config.author } });
	}

	if (config.seo.canonical && url) {
		const canonical = meta.canonical ?? url;
		tags.push({ tag: "link", attrs: { rel: "canonical", href: canonical } });
	}

	if (meta.noindex || config.seo.noindex) {
		tags.push({ tag: "meta", attrs: { name: "robots", content: "noindex, nofollow" } });
	}

	if (config.seo.openGraph) {
		tags.push({ tag: "meta", attrs: { property: "og:type", content: meta.ogType ?? "website" } });
		tags.push({ tag: "meta", attrs: { property: "og:title", content: title } });
		tags.push({ tag: "meta", attrs: { property: "og:description", content: description } });
		tags.push({ tag: "meta", attrs: { property: "og:site_name", content: config.title } });
		tags.push({
			tag: "meta",
			attrs: { property: "og:locale", content: config.lang.replace("-", "_") },
		});
		if (url) {
			tags.push({ tag: "meta", attrs: { property: "og:url", content: url } });
		}
		if (ogImage) {
			tags.push({ tag: "meta", attrs: { property: "og:image", content: ogImage } });
			tags.push({ tag: "meta", attrs: { property: "og:image:alt", content: title } });
		}
		if (meta.ogType === "article") {
			if (meta.publishedTime) {
				tags.push({
					tag: "meta",
					attrs: { property: "article:published_time", content: meta.publishedTime },
				});
			}
			if (meta.modifiedTime) {
				tags.push({
					tag: "meta",
					attrs: { property: "article:modified_time", content: meta.modifiedTime },
				});
			}
			if (meta.author) {
				tags.push({ tag: "meta", attrs: { property: "article:author", content: meta.author } });
			}
			if (meta.tags) {
				for (const tag of meta.tags) {
					tags.push({ tag: "meta", attrs: { property: "article:tag", content: tag } });
				}
			}
		}
	}

	if (config.seo.twitterCard) {
		tags.push({ tag: "meta", attrs: { name: "twitter:card", content: "summary_large_image" } });
		tags.push({ tag: "meta", attrs: { name: "twitter:title", content: title } });
		tags.push({ tag: "meta", attrs: { name: "twitter:description", content: description } });
		if (config.twitter) {
			tags.push({ tag: "meta", attrs: { name: "twitter:site", content: `@${config.twitter}` } });
			tags.push({
				tag: "meta",
				attrs: { name: "twitter:creator", content: `@${config.twitter}` },
			});
		}
		if (ogImage) {
			tags.push({ tag: "meta", attrs: { name: "twitter:image", content: ogImage } });
		}
	}

	if (jsonLd) {
		const safeJson = JSON.stringify(jsonLd)
			.replace(/</g, "\\u003c")
			.replace(/>/g, "\\u003e")
			.replace(/&/g, "\\u0026");
		tags.push({
			tag: "script",
			attrs: { type: "application/ld+json" },
			text: safeJson,
		});
	}

	return tags;
}

function serializeSeoTags(tags: SeoTagNode[]): string {
	return tags.map(serializeSeoTag).join("\n");
}

function serializeSeoTag(node: SeoTagNode): string {
	if (node.tag === "title") {
		return `<title>${escapeHtml(node.text ?? "")}</title>`;
	}
	if (node.tag === "script") {
		const attrs = formatAttrs(node.attrs);
		return `<script${attrs}>${node.text ?? ""}</script>`;
	}
	const attrs = formatAttrs(node.attrs);
	return `<${node.tag}${attrs} />`;
}

function formatAttrs(attrs?: Record<string, string>): string {
	if (!attrs) return "";
	return Object.entries(attrs)
		.map(([key, value]) => ` ${key}="${escapeAttr(value)}"`)
		.join("");
}

/** Turn the RSS helper string into a node list (keeps one serialization path). */
function parseSingleLinkTag(html: string): SeoTagNode[] {
	const match = html.match(/<link\s+([^>]+?)\s*\/>/);
	if (!match) return [];
	const attrs: Record<string, string> = {};
	for (const part of match[1].matchAll(/([^\s=]+)="([^"]*)"/g)) {
		attrs[part[1]] = part[2]
			.replace(/&quot;/g, '"')
			.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">")
			.replace(/&amp;/g, "&");
	}
	return [{ tag: "link", attrs }];
}

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
