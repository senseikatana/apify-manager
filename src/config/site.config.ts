import { useLogger } from "@/core/index.js";
import { useSeoMeta } from "./seo.service.js";

/**
 * Site-wide configuration for KatanaKit SEO / RSS helpers.
 * Framework-agnostic — reuse in Vanilla, Astro, Vue/React SPAs, Express, etc.
 *
 * @example
 * ```ts
 * // astro.config.mjs
 * import { siteConfig } from "./src/config/site.config.js";
 * export default defineConfig({ site: siteConfig.site });
 * ```
 */

export interface SiteConfig {
	/** Base URL of the site (no trailing slash). */
	site: string;
	/** Site title (used in `<title>`, RSS, Open Graph). */
	title: string;
	/** Default meta description. */
	description: string;
	/** Language code (e.g. "en", "es"). */
	lang: string;
	/** Author name for RSS and meta tags. */
	author: string;
	/** Social/OG image URL (absolute or relative to public/). */
	ogImage?: string;
	/** Twitter handle (without @). */
	twitter?: string;
	/** RSS feed configuration. */
	rss: {
		/** Whether to enable the RSS feed (default: true). */
		enabled: boolean;
		/** Output path (default: "/rss.xml"). */
		path: string;
		/** Feed title (defaults to site title). */
		title?: string;
		/** Feed description (defaults to site description). */
		description?: string;
		/** Number of items to include (default: 20). */
		limit: number;
	};
	/** Default SEO settings. */
	seo: {
		/** Whether to add noindex to all pages (default: false). */
		noindex: boolean;
		/** Whether to add the canonical URL (default: true). */
		canonical: boolean;
		/** Whether to add Open Graph tags (default: true). */
		openGraph: boolean;
		/** Whether to add Twitter Card tags (default: true). */
		twitterCard: boolean;
		/** Whether to add JSON-LD structured data (default: true). */
		jsonLd: boolean;
	};
	/** Navigation links (optional, for header/footer). */
	nav?: Array<{
		label: string;
		href: string;
		external?: boolean;
	}>;
}

/**
 * Default site configuration. Override in your project.
 *
 * @example
 * ```ts
 * // src/config/site.config.ts
 * import { type SiteConfig } from "katanakit";
 *
 * export const siteConfig: SiteConfig = {
 *   site: "https://myblog.com",
 *   title: "My Blog",
 *   description: "A blog about TypeScript",
 *   lang: "en",
 *   author: "John Doe",
 *   ogImage: "/og-default.png",
 *   twitter: "johndoe",
 *   rss: { enabled: true, path: "/rss.xml", limit: 20 },
 *   seo: { noindex: false, canonical: true, openGraph: true, twitterCard: true, jsonLd: true },
 *   nav: [
 *     { label: "Home", href: "/" },
 *     { label: "Blog", href: "/blog" },
 *     { label: "GitHub", href: "https://github.com/...", external: true },
 *   ],
 * };
 * ```
 */
// export const siteConfig: SiteConfig = {
// 	site: "https://example.com",
// 	title: "My Site",
// 	description: "A site built with KatanaKit and Astro",
// 	lang: "en",
// 	author: "Author",
// 	rss: {
// 		enabled: true,
// 		path: "/rss.xml",
// 		limit: 20,
// 	},
// 	seo: {
// 		noindex: false,
// 		canonical: true,
// 		openGraph: true,
// 		twitterCard: true,
// 		jsonLd: true,
// 	},
// };

export const seo = useSeoMeta({});

seo.title.toString();

seo.config.title;
