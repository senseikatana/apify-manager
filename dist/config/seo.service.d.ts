import type { SeoMeta, SeoMetaInput, SeoTagNode, UseSeoMetaBase, UseSeoMetaOptions } from "./seo-meta.types.js";
import { type SiteConfig } from "./site.config.js";
export type { SeoArrayable, SeoBooleanable, SeoMeta, SeoMetaArticle, SeoMetaFlat, SeoMetaInput, SeoOgImageObject, SeoRobotsObject, SeoTagNode, UseSeoMetaBase, UseSeoMetaOptions, } from "./seo-meta.types.js";
/**
 * Result of {@link useSeoMeta}: `html` / `tags` for the head, plus **one**
 * flat object of resolved fields (site + HTML + OG). No duplicate
 * `title` / `meta.title` / `config.title`.
 *
 * - `title` = document title (page)
 * - `siteTitle` = brand / site name
 * - `html` / `tags` = what you inject into `<head>`
 */
export type SeoTagResult = UseSeoMetaOptions & {
    html: string;
    tags: SeoTagNode[];
    jsonLd?: Record<string, unknown>;
};
/** @deprecated Use {@link SeoTagResult}. */
export type SeoTagsResult = SeoTagResult;
/**
 * SEO helper: one flat object in → one flat object out (+ html/tags).
 *
 * @example
 * ```ts
 * const seo = useSeoMeta({
 *   site: "https://example.com",
 *   siteTitle: "My Site",
 *   title: "Home",
 *   description: "…",
 *   ogImage: "https://example.com/image.png",
 * });
 * // seo.title, seo.site, seo.ogImage — once each
 * // seo.html / seo.tags — head injection
 * ```
 */
export declare function useSeoMeta<OmitKeys extends keyof UseSeoMetaBase = never>(opts: UseSeoMetaOptions<OmitKeys>, defaults?: SiteConfig): SeoTagResult;
/**
 * @deprecated Prefer {@link useSeoMeta} with a unified flat object.
 * Legacy: `useSeoTag(siteConfig, { title, description, ... })`.
 */
export declare function useSeoTag(config: SiteConfig, meta: SeoMeta): SeoTagResult;
/** @deprecated Prefer {@link useSeoMeta}. */
export declare const useSeoTags: typeof useSeoTag;
/**
 * Applies tags from a {@link SeoTagResult} into `document.head` (Vanilla / SPA).
 * No-op when `document` is unavailable (SSR).
 */
export declare function useApplySeoTag(seo: SeoTagResult, head?: ParentNode | null): void;
/** HTML string of meta tags (no RSS). Prefer {@link useSeoMeta}. */
export declare function useGenerateMetaTags(config: SiteConfig, meta: SeoMeta): string;
export declare function useTitle(config: SiteConfig, pageTitle?: string): string;
export declare function useRssHeadLink(config: SiteConfig): string;
/** Full `<head>` HTML (meta + RSS). Accepts legacy {@link SeoMeta} or flat {@link SeoMetaInput}. */
export declare function useHeadTags(config: SiteConfig, meta: SeoMeta | SeoMetaInput): string;
//# sourceMappingURL=seo.service.d.ts.map