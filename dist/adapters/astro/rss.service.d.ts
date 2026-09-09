import type { SiteConfig } from "../../config/site.config.js";
import type { RssConfig, RssItem, RssResult } from "../../types/index.js";
/**
 * Generate RSS 2.0 XML string from a config.
 * Returns a Safe Result (no throwing).
 *
 * @param config - RSS configuration
 * @returns Safe result with XML string or error
 *
 * @example
 * ```ts
 * const result = useAstroGenerateRss({
 *   title: "My Blog",
 *   description: "Posts about TypeScript",
 *   site: "https://example.com",
 *   items: [{ title: "Hello", pubDate: new Date(), link: "/blog/hello/" }],
 * });
 * if (result.ok) console.log(result.data); // XML string
 * ```
 */
export declare const useAstroGenerateRss: (config: RssConfig) => RssResult;
/**
 * Generate an HTML `<link>` tag for the RSS feed.
 *
 * @param config - Config with title and optional xmlPath
 * @returns HTML link tag string
 *
 * @example
 * ```ts
 * const tag = useAstroRssLinkTag({ title: "My Blog" });
 * // <link rel="alternate" type="application/rss+xml" title="My Blog" href="/rss.xml" />
 * ```
 */
export declare const useAstroRssLinkTag: (config: Pick<RssConfig, "title" | "xmlPath">) => string;
/**
 * Create an Astro-compatible GET endpoint handler for the RSS feed.
 *
 * @param config - RSS config with items (static array or async factory)
 * @returns Astro GET handler function
 *
 * @example
 * ```ts
 * // src/pages/rss.xml.ts
 * import { useAstroCreateRssEndpoint } from "katanakit-js/adapters/astro";
 * import { getCollection } from "astro:content";
 *
 * export const GET = useAstroCreateRssEndpoint({
 *   title: "My Blog",
 *   description: "Posts about TypeScript",
 *   site: "https://example.com",
 *   items: async () => {
 *     const posts = await getCollection("blog");
 *     return posts.map(post => ({
 *       title: post.data.title,
 *       pubDate: post.data.date,
 *       link: `/blog/${post.slug}/`,
 *     }));
 *   },
 * });
 * ```
 */
export declare const useAstroCreateRssEndpoint: (config: Omit<RssConfig, "items"> & {
    items: RssItem[] | (() => RssItem[] | Promise<RssItem[]>);
}) => ((context: {
    site?: URL | string;
}) => Promise<Response>);
/**
 * Create an RSS endpoint from a SiteConfig.
 * Reads title, description, site, and rss settings from the config.
 *
 * @param siteConfig - Site configuration object
 * @param items - RSS items or async factory
 * @returns Astro GET handler function
 *
 * @example
 * ```ts
 * // src/pages/rss.xml.ts
 * import { useAstroCreateRssEndpointFromConfig } from "katanakit-js/adapters/astro";
 * import { siteConfig } from "@/config/site.config";
 * import { getCollection } from "astro:content";
 *
 * export const GET = useAstroCreateRssEndpointFromConfig(siteConfig, async () => {
 *   const posts = await getCollection("blog");
 *   return posts.map(post => ({
 *     title: post.data.title,
 *     pubDate: post.data.date,
 *     link: `/blog/${post.slug}/`,
 *   }));
 * });
 * ```
 */
export declare const useAstroCreateRssEndpointFromConfig: (siteConfig: SiteConfig, items: RssItem[] | (() => RssItem[] | Promise<RssItem[]>)) => ((context: {
    site?: URL | string;
}) => Promise<Response>);
//# sourceMappingURL=rss.service.d.ts.map