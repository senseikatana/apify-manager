/**
 * Astro SEO adapter — re-exports the pure config helpers with Astro-oriented naming.
 *
 * Astro has no Nuxt-style reactive `useHead` / `useSeoMeta` in `.astro` frontmatter.
 * Use `useSeoTags` (or `useHeadTags`) to build HTML / props, then inject into
 * `<head>` via Layout props or `<Fragment set:html={...} />`.
 */
export {
	type SeoMeta,
	type SeoTagsResult,
	useGenerateMetaTags,
	useHeadTags,
	useRssHeadLink,
	useSeoTags,
	useTitle,
} from "../../config/seo.service.js";
export { type SiteConfig, siteConfig } from "../../config/site.config.js";
