import { describe, expect, it } from "vitest";
import {
	useGenerateMetaTags,
	useHeadTags,
	useRssHeadLink,
	useSeoMeta,
	useSeoTag,
	useSeoTags,
	useTitle,
} from "@/config/seo.service";
import { type SiteConfig, siteConfig } from "@/config/site.config";

const config: SiteConfig = {
	site: "https://example.com",
	title: "My Site",
	description: "Site description",
	lang: "en-US",
	author: "John Doe",
	ogImage: "/og-default.png",
	twitter: "johndoe",
	rss: { enabled: true, path: "/rss.xml", limit: 20 },
	seo: { noindex: false, canonical: true, openGraph: true, twitterCard: true, jsonLd: true },
};

describe("seo.service", () => {
	describe("useTitle", () => {
		it("returns site title when no page title", () => {
			expect(useTitle(config)).toBe("<title>My Site</title>");
		});

		it("returns page title when it equals site title", () => {
			expect(useTitle(config, "My Site")).toBe("<title>My Site</title>");
		});

		it("combines page and site title", () => {
			expect(useTitle(config, "Blog Post")).toBe("<title>Blog Post | My Site</title>");
		});

		it("escapes HTML in title", () => {
			expect(useTitle(config, "Post <script>")).toContain("Post &lt;script&gt;");
		});
	});

	describe("useGenerateMetaTags", () => {
		it("generates basic meta tags", () => {
			const tags = useGenerateMetaTags(config, {
				title: "Blog Post",
				description: "A great post",
				url: "https://example.com/blog/post/",
			});

			expect(tags).toContain("<title>Blog Post | My Site</title>");
			expect(tags).toContain('<meta name="description" content="A great post" />');
			expect(tags).toContain('<meta name="author" content="John Doe" />');
			expect(tags).toContain('<link rel="canonical" href="https://example.com/blog/post/" />');
		});

		it("adds noindex when requested", () => {
			const tags = useGenerateMetaTags(config, {
				title: "Private",
				noindex: true,
			});
			expect(tags).toContain('<meta name="robots" content="noindex, nofollow" />');
		});

		it("generates Open Graph tags", () => {
			const tags = useGenerateMetaTags(config, {
				title: "Blog Post",
				url: "https://example.com/blog/post/",
			});

			expect(tags).toContain('<meta property="og:type" content="website" />');
			expect(tags).toContain('<meta property="og:title" content="Blog Post | My Site" />');
			expect(tags).toContain('<meta property="og:site_name" content="My Site" />');
			expect(tags).toContain('<meta property="og:locale" content="en_US" />');
			expect(tags).toContain('<meta property="og:url" content="https://example.com/blog/post/" />');
			// ogImage is relative → converted to absolute.
			expect(tags).toContain(
				'<meta property="og:image" content="https://example.com/og-default.png" />',
			);
		});

		it("generates article tags when ogType=article", () => {
			const tags = useGenerateMetaTags(config, {
				title: "Blog Post",
				url: "https://example.com/blog/post/",
				ogType: "article",
				publishedTime: "2024-01-15T00:00:00Z",
				modifiedTime: "2024-01-16T00:00:00Z",
				author: "Jane Doe",
				tags: ["typescript", "astro"],
			});

			expect(tags).toContain('<meta property="og:type" content="article" />');
			expect(tags).toContain(
				'<meta property="article:published_time" content="2024-01-15T00:00:00Z" />',
			);
			expect(tags).toContain(
				'<meta property="article:modified_time" content="2024-01-16T00:00:00Z" />',
			);
			expect(tags).toContain('<meta property="article:author" content="Jane Doe" />');
			expect(tags).toContain('<meta property="article:tag" content="typescript" />');
			expect(tags).toContain('<meta property="article:tag" content="astro" />');
		});

		it("generates Twitter Card tags", () => {
			const tags = useGenerateMetaTags(config, {
				title: "Blog Post",
			});

			expect(tags).toContain('<meta name="twitter:card" content="summary_large_image" />');
			expect(tags).toContain('<meta name="twitter:site" content="@johndoe" />');
			expect(tags).toContain('<meta name="twitter:creator" content="@johndoe" />');
		});

		it("includes JSON-LD with script-safe escaping", () => {
			// ogType "article" embeds the title into the JSON-LD headline,
			// which is where the `</script>` breakout must be neutralized.
			const tags = useGenerateMetaTags(config, {
				title: "Post </script><img src=x onerror=alert(1)>",
				ogType: "article",
				publishedTime: "2024-01-15T00:00:00Z",
			});

			expect(tags).toContain('<script type="application/ld+json">');
			// The `</script>` must be escaped to prevent XSS.
			expect(tags).toContain("\\u003c/script\\u003e");
			expect(tags).not.toContain("</script><img");
		});
	});

	describe("useRssHeadLink", () => {
		it("generates the RSS link tag", () => {
			expect(useRssHeadLink(config)).toBe(
				'<link rel="alternate" type="application/rss+xml" title="My Site" href="/rss.xml" />',
			);
		});

		it("returns empty string when RSS disabled", () => {
			const disabled: SiteConfig = { ...config, rss: { ...config.rss, enabled: false } };
			expect(useRssHeadLink(disabled)).toBe("");
		});
	});

	describe("useHeadTags", () => {
		it("combines meta tags and RSS link", () => {
			const tags = useHeadTags(config, { title: "Blog Post" });

			expect(tags).toContain("<title>Blog Post | My Site</title>");
			expect(tags).toContain('rel="alternate"');
			expect(tags).toContain("application/rss+xml");
		});
	});

	describe("useSeoTag", () => {
		it("returns html, tags, and resolved fields (framework-agnostic)", () => {
			const seo = useSeoTag(config, {
				title: "Blog Post",
				description: "A great post",
				url: "https://example.com/blog/post/",
			});

			expect(seo.title).toBe("Blog Post | My Site");
			expect(seo.description).toBe("A great post");
			expect(seo.url).toBe("https://example.com/blog/post/");
			expect(seo.ogImage).toBe("https://example.com/og-default.png");
			expect(seo.meta.title).toBe("Blog Post | My Site");
			expect(seo.html).toContain("<title>Blog Post | My Site</title>");
			expect(seo.html).toContain('rel="alternate"');
			expect(seo.html).toBe(useHeadTags(config, seo.meta));
			expect(seo.tags.some((t) => t.tag === "title" && t.text === "Blog Post | My Site")).toBe(
				true,
			);
			expect(seo.tags.some((t) => t.tag === "link" && t.attrs?.rel === "alternate")).toBe(true);
		});

		it("falls back to site defaults when page fields are omitted", () => {
			const seo = useSeoTag(config, { title: "My Site" });

			expect(seo.title).toBe("My Site");
			expect(seo.description).toBe("Site description");
			expect(seo.url).toBe("https://example.com");
		});

		it("keeps useSeoTags as an alias", () => {
			expect(useSeoTags(config, { title: "Alias" }).title).toBe(
				useSeoTag(config, { title: "Alias" }).title,
			);
		});
	});

	describe("useSeoMeta", () => {
		it("accepts a Nuxt-style flat object and resolves immediately", () => {
			const seo = useSeoMeta(
				{
					title: "My Amazing Site",
					ogTitle: "My Amazing Site",
					description: "This is my amazing site",
					ogDescription: "This is my amazing site",
					ogImage: "https://example.com/image.png",
					twitterCard: "summary_large_image",
					ogType: "website",
					canonical: "https://example.com/",
					robots: "index, follow",
				},
				config,
			);

			expect(seo.html).toContain("<title>My Amazing Site | My Site</title>");
			expect(seo.html).toContain('<meta property="og:title" content="My Amazing Site" />');
			expect(seo.html).toContain(
				'<meta property="og:image" content="https://example.com/image.png" />',
			);
			expect(seo.html).toContain('<meta name="twitter:card" content="summary_large_image" />');
			expect(seo.html).toContain('<link rel="canonical" href="https://example.com/" />');
			expect(seo.html).toContain('<meta name="robots" content="index, follow" />');
			expect(seo.tags.length).toBeGreaterThan(5);
		});

		it("supports structured robots and article tags", () => {
			const seo = useSeoMeta(
				{
					title: "Article",
					ogType: "article",
					articlePublishedTime: "2024-01-15T00:00:00Z",
					articleTag: ["typescript", "seo"],
					robots: { noindex: true, nofollow: true },
				},
				config,
			);

			expect(seo.html).toContain(
				'<meta property="article:published_time" content="2024-01-15T00:00:00Z" />',
			);
			expect(seo.html).toContain('<meta property="article:tag" content="typescript" />');
			expect(seo.html).toContain('<meta name="robots" content="noindex, nofollow" />');
		});

		it("works without site config (pure flat input)", () => {
			const seo = useSeoMeta({
				title: "Standalone",
				description: "No site config",
				ogImage: "https://cdn.example.com/og.png",
			});

			expect(seo.title).toBe("Standalone");
			expect(seo.description).toBe("No site config");
			expect(seo.html).toContain("<title>Standalone</title>");
			expect(seo.html).toContain(
				'<meta property="og:image" content="https://cdn.example.com/og.png" />',
			);
			expect(seo.html).not.toContain("application/rss+xml");
		});
	});

	describe("siteConfig defaults", () => {
		it("has sensible defaults", () => {
			expect(siteConfig.site).toBeDefined();
			expect(siteConfig.title).toBeDefined();
			expect(siteConfig.lang).toBe("en");
			expect(siteConfig.rss.enabled).toBe(true);
			expect(siteConfig.seo.openGraph).toBe(true);
			expect(siteConfig.seo.twitterCard).toBe(true);
			expect(siteConfig.seo.jsonLd).toBe(true);
		});
	});
});
