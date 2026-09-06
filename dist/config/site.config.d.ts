/**
 * Site-wide configuration for KatanaKit SEO / RSS helpers.
 * Framework-agnostic — reuse in Vanilla, Astro, Vue/React SPAs, Express, etc.
 *
 * Prefer defining your own `siteConfig` in the consuming app.
 * This default is only a demo / fallback for {@link useSeoMeta}.
 *
 * Do not import `useSeoMeta` here — that creates a circular dependency
 * (`seo.service` imports `siteConfig` as defaults).
 */
export interface SiteConfig {
    /** Base URL of the site (no trailing slash). */
    site: string;
    /** Site brand title (not the page `<title>` — that is `title` on useSeoMeta). */
    title: string;
    /** Default meta description. */
    description: string;
    /** Language code (e.g. "en", "es"). */
    lang: string;
    /** Author name for RSS and meta tags. */
    author: string;
    /** Social/OG image URL (absolute or relative to public/). */
    ogImage?: string;
    /** @deprecated Unused by useSeoMeta (HTML + OG only). */
    twitter?: string;
    rss: {
        enabled: boolean;
        path: string;
        title?: string;
        description?: string;
        limit: number;
    };
    seo: {
        noindex: boolean;
        canonical: boolean;
        openGraph: boolean;
        /** @deprecated Unused by useSeoMeta. */
        twitterCard: boolean;
        jsonLd: boolean;
    };
    nav?: Array<{
        label: string;
        href: string;
        external?: boolean;
    }>;
}
/** Demo defaults — override in your project. */
export declare const siteConfig: SiteConfig;
//# sourceMappingURL=site.config.d.ts.map