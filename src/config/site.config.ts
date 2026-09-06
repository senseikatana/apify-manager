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

// /** Demo defaults — override in your project. */
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
// 		twitterCard: false,
// 		jsonLd: true,
// 	},
// };

/* 
---
// src/layouts/Layout.astro
import { useSeoMeta } from "katanakit-js";
// o: import { useSeoMeta } from "katanakit-js/adapters/astro";

interface Props {
  title?: string;
  description?: string;
  ogImage?: string;
  canonical?: string;
}

const {
  title = "Home",
  description = "Mi sitio con Astro",
  ogImage,
  canonical,
} = Astro.props;

const seo = useSeoMeta({
  site: "https://mi-sitio.com",       // URL base del proyecto
  siteTitle: "Mi Sitio",              // marca (sufijo del <title>)
  title,                              // titulo de ESTA pagina
  description,
  url: Astro.url.href,                // URL absoluta de la pagina actual
  canonical: canonical ?? Astro.url.href,
  ogImage: ogImage ?? "https://mi-sitio.com/og-default.png",
  lang: "es",
});
---

<!doctype html>
<html lang={seo.lang ?? "es"}>
  <head>
    <meta charset="utf-8" />
	* TODO: clave de como se usa en Astro 
    <Fragment set:html={seo.html} />
  </head>
  <body>
    <slot />
  </body>
</html>
** <head>
  {seo.tags.map((node) => {
    if (node.tag === "title") return <title>{node.text}</title>;
    if (node.tag === "script")
      return <script type="application/ld+json" set:html={node.text} />;
    if (node.tag === "link") return <link {...node.attrs} />;
    return <meta {...node.attrs} />;
  })}
</head>




---
// src/pages/blog/hola.astro
import Layout from "../layouts/Layout.astro";
---

<Layout
  title="Hola mundo"
  description="Mi primer post"
  ogImage="https://mi-sitio.com/posts/hola.png"
>
  <article>
    <h1>Hola mundo</h1>
  </article>
</Layout>

*/
