import type { SiteConfig } from "./site.config.js";
import type {
	SeoMeta,
	SeoMetaInput,
	SeoOgImageObject,
	SeoRobotsObject,
	SeoTagNode,
} from "./seo-meta.types.js";

export type {
	SeoArrayable,
	SeoBooleanable,
	SeoMeta,
	SeoMetaArticle,
	SeoMetaBook,
	SeoMetaFlat,
	SeoMetaInput,
	SeoMetaProfile,
	SeoOgImageObject,
	SeoOgVideoObject,
	SeoRobotsObject,
	SeoTagNode,
} from "./seo-meta.types.js";

/**
 * Resolved SEO payload from {@link useSeoMeta} / {@link useSeoTag}.
 *
 * - **SSR / Astro / templates:** use `html`
 * - **Vanilla / SPA:** use `tags` + {@link useApplySeoTag}
 * - **Any framework:** use resolved fields as props
 *
 * Inside Nuxt apps prefer Nuxt's own `useSeoMeta` / `useHead`.
 */
export interface SeoTagResult {
	html: string;
	tags: SeoTagNode[];
	title: string;
	description: string;
	url: string;
	ogImage?: string;
	/** Flat input after site defaults were merged. */
	meta: SeoMetaInput;
	jsonLd?: Record<string, unknown>;
}

/** @deprecated Use {@link SeoTagResult}. */
export type SeoTagsResult = SeoTagResult;

/**
 * Builds SEO tags from a Nuxt-style flat object. Resolves immediately (no reactivity).
 *
 * @example
 * ```ts
 * import { useSeoMeta, useApplySeoTag } from "katanakit-js";
 *
 * const seo = useSeoMeta({
 *   title: "My Amazing Site",
 *   ogTitle: "My Amazing Site",
 *   description: "This is my amazing site",
 *   ogDescription: "This is my amazing site",
 *   ogImage: "https://example.com/image.png",
 *   twitterCard: "summary_large_image",
 * });
 * useApplySeoTag(seo);
 * ```
 */
export function useSeoMeta(input: SeoMetaInput, config?: SiteConfig): SeoTagResult {
	const merged = mergeSeoDefaults(input, config);
	const tags = flattenSeoMetaToTags(merged, config);
	if (config) {
		const rss = buildRssTagNode(config);
		if (rss) tags.push(rss);
		if (config.seo.jsonLd) {
			const jsonLd = buildJsonLdFromInput(merged, config);
			if (jsonLd) {
				tags.push({
					tag: "script",
					attrs: { type: "application/ld+json" },
					text: safeJsonLd(jsonLd),
				});
			}
		}
	}

	const title = String(merged.title ?? config?.title ?? "");
	const description = String(merged.description ?? config?.description ?? "");
	const url = String(merged.ogUrl ?? merged.canonical ?? merged.url ?? config?.site ?? "");
	const ogImage = resolveOgImageUrl(merged, config);

	return {
		html: serializeSeoTags(tags),
		tags,
		title,
		description,
		url,
		ogImage,
		meta: merged,
		jsonLd: config?.seo.jsonLd ? buildJsonLdFromInput(merged, config) : undefined,
	};
}

/**
 * @deprecated Prefer {@link useSeoMeta} with a Nuxt-style flat object.
 * Legacy: `useSeoTag(siteConfig, { title, description, ... })`.
 */
export function useSeoTag(config: SiteConfig, meta: SeoMeta): SeoTagResult {
	return useSeoMeta(legacySeoMetaToInput(meta), config);
}

/** @deprecated Prefer {@link useSeoMeta}. */
export const useSeoTags = useSeoTag;

/**
 * Applies {@link SeoTagResult.tags} into `document.head` (Vanilla / SPA).
 * No-op when `document` is unavailable (SSR).
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

/** HTML string of meta tags (no RSS). Prefer {@link useSeoMeta}. */
export function useGenerateMetaTags(config: SiteConfig, meta: SeoMeta): string {
	const { tags } = useSeoMeta(legacySeoMetaToInput(meta), {
		...config,
		rss: { ...config.rss, enabled: false },
		seo: { ...config.seo, jsonLd: config.seo.jsonLd },
	});
	// Re-run without RSS: strip rss by using disabled rss above; jsonLd still included.
	return serializeSeoTags(tags.filter((t) => !(t.tag === "link" && t.attrs?.rel === "alternate")));
}

export function useTitle(config: SiteConfig, pageTitle?: string): string {
	if (!pageTitle || pageTitle === config.title) {
		return `<title>${escapeHtml(config.title)}</title>`;
	}
	return `<title>${escapeHtml(`${pageTitle} | ${config.title}`)}</title>`;
}

export function useRssHeadLink(config: SiteConfig): string {
	const node = buildRssTagNode(config);
	return node ? serializeSeoTag(node) : "";
}

/** Full `<head>` HTML (meta + RSS). Accepts legacy {@link SeoMeta} or flat {@link SeoMetaInput}. */
export function useHeadTags(config: SiteConfig, meta: SeoMeta | SeoMetaInput): string {
	if (isLegacySeoMeta(meta)) {
		return useSeoTag(config, meta).html;
	}
	return useSeoMeta(meta, config).html;
}

function isLegacySeoMeta(meta: SeoMeta | SeoMetaInput): meta is SeoMeta {
	return (
		"publishedTime" in meta ||
		"modifiedTime" in meta ||
		"noindex" in meta ||
		("tags" in meta && !("articleTag" in meta))
	);
}

// --- Merge & legacy ---

function legacySeoMetaToInput(meta: SeoMeta): SeoMetaInput {
	const input: SeoMetaInput = {
		title: meta.title,
		description: meta.description,
		canonical: meta.canonical,
		url: meta.url,
		ogUrl: meta.url,
		ogImage: meta.ogImage,
		ogType: meta.ogType,
		author: meta.author,
	};
	if (meta.ogType === "article") {
		input.articlePublishedTime = meta.publishedTime;
		input.articleModifiedTime = meta.modifiedTime;
		input.articleTag = meta.tags;
		input.articleAuthor = meta.author ? [meta.author] : undefined;
	}
	if (meta.noindex) {
		input.robots = "noindex, nofollow";
	}
	return input;
}

function mergeSeoDefaults(input: SeoMetaInput, config?: SiteConfig): SeoMetaInput {
	if (!config) return { ...input };

	const pageTitle = input.title ?? config.title;
	const siteSuffix = ` | ${config.title}`;
	const alreadySuffixed =
		typeof pageTitle === "string" &&
		pageTitle !== config.title &&
		pageTitle.endsWith(siteSuffix);
	const title =
		pageTitle === config.title || !pageTitle || alreadySuffixed
			? (pageTitle ?? config.title)
			: `${pageTitle} | ${config.title}`;

	const description = input.description ?? config.description;
	const url = input.ogUrl ?? input.canonical ?? input.url ?? config.site;
	const ogImage = input.ogImage ?? config.ogImage;

	const merged: SeoMetaInput = {
		...input,
		title,
		description,
		ogTitle: input.ogTitle ?? title,
		ogDescription: input.ogDescription ?? description,
		ogUrl: input.ogUrl ?? url,
		ogSiteName: input.ogSiteName ?? config.title,
		ogLocale: input.ogLocale ?? config.lang.replace("-", "_"),
		ogType: input.ogType ?? "website",
		author: input.author ?? config.author,
		canonical: input.canonical ?? (config.seo.canonical ? url : input.canonical),
		url,
	};

	if (ogImage !== undefined && ogImage !== null) {
		merged.ogImage = ogImage;
	}

	if (config.seo.noindex && merged.robots == null) {
		merged.robots = "noindex, nofollow";
	}

	if (config.seo.twitterCard) {
		merged.twitterCard = input.twitterCard ?? "summary_large_image";
		merged.twitterTitle = input.twitterTitle ?? title;
		merged.twitterDescription = input.twitterDescription ?? description;
		if (config.twitter) {
			const handle = config.twitter.startsWith("@") ? config.twitter : `@${config.twitter}`;
			merged.twitterSite = input.twitterSite ?? handle;
			merged.twitterCreator = input.twitterCreator ?? handle;
		}
		const imageUrl = resolveOgImageUrl(merged, config);
		if (imageUrl && merged.twitterImage == null) {
			merged.twitterImage = imageUrl;
		}
	}

	if (!config.seo.openGraph) {
		for (const key of Object.keys(merged) as (keyof SeoMetaInput)[]) {
			if (String(key).startsWith("og") || String(key).startsWith("article")) {
				delete merged[key];
			}
		}
		// Keep title/description/canonical/author
		merged.title = title;
		merged.description = description;
		merged.author = input.author ?? config.author;
		merged.canonical = input.canonical ?? (config.seo.canonical ? url : undefined);
	}

	return merged;
}

function resolveOgImageUrl(input: SeoMetaInput, config?: SiteConfig): string | undefined {
	const raw = input.ogImage ?? input.ogImageUrl ?? config?.ogImage;
	if (raw == null) return undefined;
	if (typeof raw === "string") {
		return absoluteUrl(raw, config?.site);
	}
	const first = Array.isArray(raw) ? raw[0] : raw;
	if (first && typeof first === "object" && "url" in first && first.url) {
		return absoluteUrl(String(first.url), config?.site);
	}
	return undefined;
}

function absoluteUrl(value: string, site?: string): string {
	if (value.startsWith("http://") || value.startsWith("https://")) return value;
	if (!site) return value;
	return `${site.replace(/\/$/, "")}${value.startsWith("/") ? value : `/${value}`}`;
}

// --- Flatten input → nodes ---

const NAME_KEYS = new Set([
	"description",
	"keywords",
	"author",
	"creator",
	"publisher",
	"generator",
	"applicationName",
	"colorScheme",
	"referrer",
	"viewport",
	"robots",
	"google",
	"googlebot",
	"googlebotNews",
	"googleSiteVerification",
	"rating",
	"themeColor",
	"twitterCard",
	"twitterSite",
	"twitterSiteId",
	"twitterCreator",
	"twitterCreatorId",
	"twitterTitle",
	"twitterDescription",
	"twitterImage",
	"twitterImageAlt",
	"twitterPlayer",
	"twitterPlayerWidth",
	"twitterPlayerHeight",
	"twitterPlayerStream",
	"twitterAppNameIphone",
	"twitterAppIdIphone",
	"twitterAppUrlIphone",
	"twitterAppNameIpad",
	"twitterAppIdIpad",
	"twitterAppUrlIpad",
	"twitterAppNameGoogleplay",
	"twitterAppIdGoogleplay",
	"twitterAppUrlGoogleplay",
	"twitterData1",
	"twitterLabel1",
	"twitterData2",
	"twitterLabel2",
	"mobileWebAppCapable",
	"appleMobileWebAppCapable",
	"appleMobileWebAppStatusBarStyle",
	"appleMobileWebAppTitle",
	"appleItunesApp",
	"formatDetection",
	"msapplicationTileImage",
	"msapplicationTileColor",
	"msapplicationConfig",
]);

const SKIP_KEYS = new Set(["url", "title", "canonical", "charset"]);

function flattenSeoMetaToTags(input: SeoMetaInput, config?: SiteConfig): SeoTagNode[] {
	const tags: SeoTagNode[] = [];

	if (input.charset) {
		tags.push({ tag: "meta", attrs: { charset: String(input.charset) } });
	}

	if (input.title != null && input.title !== "") {
		tags.push({ tag: "title", text: String(input.title) });
	}

	if (input.canonical) {
		tags.push({ tag: "link", attrs: { rel: "canonical", href: String(input.canonical) } });
	}

	for (const [key, raw] of Object.entries(input)) {
		if (raw === undefined || raw === null) continue;
		if (SKIP_KEYS.has(key)) continue;

		if (key === "ogImage" || key === "ogVideo") {
			tags.push(...flattenMediaObject(key, raw, config));
			continue;
		}

		if (key === "robots") {
			const content = serializeRobots(raw as string | SeoRobotsObject);
			if (content) tags.push({ tag: "meta", attrs: { name: "robots", content } });
			continue;
		}

		if (key === "viewport" && typeof raw === "object") {
			const content = Object.entries(raw as Record<string, unknown>)
				.filter(([, v]) => v != null)
				.map(([k, v]) => `${camelToKebab(k)}=${v}`)
				.join(", ");
			if (content) tags.push({ tag: "meta", attrs: { name: "viewport", content } });
			continue;
		}

		if (key === "themeColor" && typeof raw === "object") {
			const obj = raw as { content?: string; media?: string };
			const attrs: Record<string, string> = { name: "theme-color", content: String(obj.content ?? "") };
			if (obj.media) attrs.media = obj.media;
			tags.push({ tag: "meta", attrs });
			continue;
		}

		if (key === "appleItunesApp" && typeof raw === "object") {
			const obj = raw as { appId?: string; appArgument?: string };
			const parts = [
				obj.appId ? `app-id=${obj.appId}` : "",
				obj.appArgument ? `app-argument=${obj.appArgument}` : "",
			].filter(Boolean);
			if (parts.length) {
				tags.push({ tag: "meta", attrs: { name: "apple-itunes-app", content: parts.join(", ") } });
			}
			continue;
		}

		if (key === "fbAppId") {
			tags.push({ tag: "meta", attrs: { property: "fb:app_id", content: String(raw) } });
			continue;
		}

		if (Array.isArray(raw)) {
			for (const item of raw) {
				pushScalarMeta(tags, key, item);
			}
			continue;
		}

		pushScalarMeta(tags, key, raw);
	}

	return tags;
}

function pushScalarMeta(tags: SeoTagNode[], key: string, value: unknown): void {
	const content = String(value);
	if (NAME_KEYS.has(key) || key.startsWith("twitter") || key.startsWith("apple") || key.startsWith("msapplication")) {
		tags.push({ tag: "meta", attrs: { name: camelToMetaName(key), content } });
		return;
	}
	if (key.startsWith("og") || key.startsWith("article") || key.startsWith("book") || key.startsWith("profile")) {
		tags.push({ tag: "meta", attrs: { property: camelToMetaProperty(key), content } });
		return;
	}
	tags.push({ tag: "meta", attrs: { name: camelToMetaName(key), content } });
}

function flattenMediaObject(key: "ogImage" | "ogVideo", raw: unknown, config?: SiteConfig): SeoTagNode[] {
	const tags: SeoTagNode[] = [];
	const prop = key === "ogImage" ? "og:image" : "og:video";

	if (typeof raw === "string") {
		tags.push({
			tag: "meta",
			attrs: { property: prop, content: absoluteUrl(raw, config?.site) },
		});
		return tags;
	}

	const list = Array.isArray(raw) ? raw : [raw];
	for (const item of list) {
		if (!item || typeof item !== "object") continue;
		const obj = item as SeoOgImageObject;
		if (obj.url) {
			tags.push({
				tag: "meta",
				attrs: { property: prop, content: absoluteUrl(String(obj.url), config?.site) },
			});
		}
		if (obj.secureUrl) {
			tags.push({
				tag: "meta",
				attrs: { property: `${prop}:secure_url`, content: String(obj.secureUrl) },
			});
		}
		if (obj.type) tags.push({ tag: "meta", attrs: { property: `${prop}:type`, content: String(obj.type) } });
		if (obj.width != null) {
			tags.push({ tag: "meta", attrs: { property: `${prop}:width`, content: String(obj.width) } });
		}
		if (obj.height != null) {
			tags.push({ tag: "meta", attrs: { property: `${prop}:height`, content: String(obj.height) } });
		}
		if (obj.alt) tags.push({ tag: "meta", attrs: { property: `${prop}:alt`, content: String(obj.alt) } });
	}
	return tags;
}

function serializeRobots(value: string | SeoRobotsObject): string {
	if (typeof value === "string") return value;
	const parts: string[] = [];
	const map: Record<string, string> = {
		index: "index",
		follow: "follow",
		all: "all",
		noindex: "noindex",
		nofollow: "nofollow",
		none: "none",
		noarchive: "noarchive",
		nositelinkssearchbox: "nositelinkssearchbox",
		nosnippet: "nosnippet",
		indexifembedded: "indexifembedded",
		notranslate: "notranslate",
		noimageindex: "noimageindex",
	};
	for (const [k, directive] of Object.entries(map)) {
		if (truthy(value[k as keyof SeoRobotsObject])) parts.push(directive);
	}
	if (value.maxSnippet != null) parts.push(`max-snippet:${value.maxSnippet}`);
	if (value.maxImagePreview) parts.push(`max-image-preview:${value.maxImagePreview}`);
	if (value.maxVideoPreview != null) parts.push(`max-video-preview:${value.maxVideoPreview}`);
	if (value.unavailable_after) parts.push(`unavailable_after:${value.unavailable_after}`);
	return parts.join(", ");
}

function truthy(v: unknown): boolean {
	return v === true || v === "true" || v === 1 || v === "1";
}

function camelToKebab(key: string): string {
	return key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function camelToMetaName(key: string): string {
	if (key.startsWith("twitter")) {
		const rest = key.slice("twitter".length);
		return rest ? `twitter:${camelToKebab(rest.charAt(0).toLowerCase() + rest.slice(1))}` : "twitter";
	}
	if (key.startsWith("msapplication")) {
		return `msapplication-${camelToKebab(key.slice("msapplication".length))}`;
	}
	if (key === "googleSiteVerification") return "google-site-verification";
	if (key === "googlebotNews") return "googlebot-news";
	if (key === "applicationName") return "application-name";
	if (key === "colorScheme") return "color-scheme";
	if (key === "themeColor") return "theme-color";
	if (key === "mobileWebAppCapable") return "mobile-web-app-capable";
	if (key === "appleMobileWebAppCapable") return "apple-mobile-web-app-capable";
	if (key === "appleMobileWebAppStatusBarStyle") return "apple-mobile-web-app-status-bar-style";
	if (key === "appleMobileWebAppTitle") return "apple-mobile-web-app-title";
	if (key === "appleItunesApp") return "apple-itunes-app";
	if (key === "formatDetection") return "format-detection";
	return camelToKebab(key);
}

function camelToMetaProperty(key: string): string {
	const overrides: Record<string, string> = {
		ogSiteName: "og:site_name",
		ogImageSecureUrl: "og:image:secure_url",
		ogVideoSecureUrl: "og:video:secure_url",
		ogAudioSecureUrl: "og:audio:secure_url",
	};
	if (overrides[key]) return overrides[key];

	if (key.startsWith("og")) {
		const rest = key.slice(2);
		return `og:${rest.replace(/([a-z0-9])([A-Z])/g, "$1:$2").toLowerCase()}`;
	}
	if (key.startsWith("article")) {
		const rest = key.slice("article".length);
		return `article:${rest.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase()}`;
	}
	if (key.startsWith("book")) {
		const rest = key.slice("book".length);
		return `book:${rest.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase()}`;
	}
	if (key.startsWith("profile")) {
		const rest = key.slice("profile".length);
		return `profile:${rest.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase()}`;
	}
	return camelToKebab(key);
}

function buildRssTagNode(config: SiteConfig): SeoTagNode | null {
	if (!config.rss.enabled) return null;
	const path = config.rss.path ?? "/rss.xml";
	const title = config.rss.title ?? config.title;
	return {
		tag: "link",
		attrs: {
			rel: "alternate",
			type: "application/rss+xml",
			title,
			href: path,
		},
	};
}

function buildJsonLdFromInput(
	input: SeoMetaInput,
	config: SiteConfig,
): Record<string, unknown> | undefined {
	const url = String(input.ogUrl ?? input.canonical ?? input.url ?? config.site);

	if (input.ogType === "article") {
		return {
			"@context": "https://schema.org",
			"@type": "Article",
			headline: input.ogTitle ?? input.title,
			description: input.ogDescription ?? input.description ?? config.description,
			url,
			author: {
				"@type": "Person",
				name: input.articleAuthor?.[0] ?? input.author ?? config.author,
			},
			publisher: {
				"@type": "Organization",
				name: config.title,
			},
			datePublished: input.articlePublishedTime,
			dateModified: input.articleModifiedTime ?? input.articlePublishedTime,
			image: resolveOgImageUrl(input, config),
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

function safeJsonLd(data: Record<string, unknown>): string {
	return JSON.stringify(data)
		.replace(/</g, "\\u003c")
		.replace(/>/g, "\\u003e")
		.replace(/&/g, "\\u0026");
}

function serializeSeoTags(tags: SeoTagNode[]): string {
	return tags.map(serializeSeoTag).join("\n");
}

function serializeSeoTag(node: SeoTagNode): string {
	if (node.tag === "title") {
		return `<title>${escapeHtml(node.text ?? "")}</title>`;
	}
	if (node.tag === "script") {
		return `<script${formatAttrs(node.attrs)}>${node.text ?? ""}</script>`;
	}
	if (node.tag === "meta" && node.attrs?.charset) {
		return `<meta charset="${escapeAttr(node.attrs.charset)}" />`;
	}
	return `<${node.tag}${formatAttrs(node.attrs)} />`;
}

function formatAttrs(attrs?: Record<string, string>): string {
	if (!attrs) return "";
	return Object.entries(attrs)
		.map(([key, value]) => ` ${key}="${escapeAttr(value)}"`)
		.join("");
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
