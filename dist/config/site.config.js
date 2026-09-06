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
/** Demo defaults — override in your project. */
export const siteConfig = {
    site: "https://example.com",
    title: "My Site",
    description: "A site built with KatanaKit and Astro",
    lang: "en",
    author: "Author",
    rss: {
        enabled: true,
        path: "/rss.xml",
        limit: 20,
    },
    seo: {
        noindex: false,
        canonical: true,
        openGraph: true,
        twitterCard: false,
        jsonLd: true,
    },
};
//# sourceMappingURL=site.config.js.map