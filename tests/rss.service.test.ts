import { describe, expect, it } from "vitest";

import RssService, {
	useCreateRssEndpoint,
	useGenerateRss,
	useRssLinkTag,
} from "@/adapters/astro/rss.service";

describe("RssService", () => {
	describe("useGenerateRss", () => {
		it("generates valid RSS 2.0 XML", () => {
			const result = useGenerateRss({
				title: "My Blog",
				description: "A test blog",
				site: "https://example.com",
				items: [
					{
						title: "Hello World",
						pubDate: new Date("2024-01-15"),
						link: "/blog/hello/",
						description: "My first post",
					},
				],
			});

			expect(result.ok).toBe(true);
			if (!result.ok) return;

			expect(result.data).toContain('<?xml version="1.0" encoding="UTF-8"?>');
			expect(result.data).toContain('<rss version="2.0"');
			expect(result.data).toContain("<title>My Blog</title>");
			expect(result.data).toContain("<link>https://example.com</link>");
			expect(result.data).toContain("<title>Hello World</title>");
			expect(result.data).toContain("<link>https://example.com/blog/hello/</link>");
			expect(result.data).toContain("<description>My first post</description>");
		});

		it("escapes XML special characters", () => {
			const result = useGenerateRss({
				title: 'Blog & "Stuff"',
				description: "Posts about <HTML> & friends",
				site: "https://example.com",
				items: [
					{
						title: "A <bold> move",
						pubDate: new Date("2024-01-15"),
						link: "/post/",
					},
				],
			});

			expect(result.ok).toBe(true);
			if (!result.ok) return;

			expect(result.data).toContain("Blog &amp; &quot;Stuff&quot;");
			expect(result.data).toContain("&lt;HTML&gt;");
			expect(result.data).toContain("A &lt;bold&gt; move");
		});

		it("returns error when title is missing", () => {
			const result = useGenerateRss({
				title: "",
				description: "test",
				site: "https://example.com",
				items: [],
			});

			expect(result.ok).toBe(false);
			if (result.ok) return;
			expect(result.error.message).toContain("title");
		});

		it("returns error when site is missing", () => {
			const result = useGenerateRss({
				title: "Blog",
				description: "test",
				site: "",
				items: [],
			});

			expect(result.ok).toBe(false);
		});

		it("handles items with categories and author", () => {
			const result = useGenerateRss({
				title: "Blog",
				description: "test",
				site: "https://example.com",
				items: [
					{
						title: "Post",
						pubDate: new Date("2024-01-15"),
						link: "/post/",
						categories: ["typescript", "astro"],
						author: "John Doe",
					},
				],
			});

			expect(result.ok).toBe(true);
			if (!result.ok) return;

			expect(result.data).toContain("<category>typescript</category>");
			expect(result.data).toContain("<category>astro</category>");
			expect(result.data).toContain("<author>John Doe</author>");
		});

		it("handles absolute item links", () => {
			const result = useGenerateRss({
				title: "Blog",
				description: "test",
				site: "https://example.com",
				items: [
					{
						title: "External",
						pubDate: new Date("2024-01-15"),
						link: "https://other.com/post/",
					},
				],
			});

			expect(result.ok).toBe(true);
			if (!result.ok) return;

			expect(result.data).toContain("<link>https://other.com/post/</link>");
		});

		it("includes custom data and XSL stylesheet", () => {
			const result = useGenerateRss({
				title: "Blog",
				description: "test",
				site: "https://example.com",
				items: [],
				customData: "<copyright>All rights reserved</copyright>",
				xslUrl: "/rss.xsl",
			});

			expect(result.ok).toBe(true);
			if (!result.ok) return;

			expect(result.data).toContain("xml-stylesheet");
			expect(result.data).toContain("/rss.xsl");
			expect(result.data).toContain("<copyright>All rights reserved</copyright>");
		});

		it("sanitizes CDATA breakout sequences in content", () => {
			const result = useGenerateRss({
				title: "Blog",
				description: "test",
				site: "https://example.com",
				items: [
					{
						title: "Post",
						pubDate: new Date("2024-01-15"),
						link: "/post/",
						content: "safe ]]> breakout",
					},
				],
			});

			expect(result.ok).toBe(true);
			if (!result.ok) return;
			expect(result.data).toContain("]]]]><![CDATA[>");
			expect(result.data).not.toMatch(/<content:encoded><!\[CDATA\[safe ]]> breakout\]\]>/);
		});
	});

	describe("useRssLinkTag", () => {
		it("generates a link tag with default path", () => {
			const tag = useRssLinkTag({ title: "My Blog" });
			expect(tag).toBe(
				'<link rel="alternate" type="application/rss+xml" title="My Blog" href="/rss.xml" />',
			);
		});

		it("generates a link tag with custom path", () => {
			const tag = useRssLinkTag({ title: "My Blog", xmlPath: "/feed.xml" });
			expect(tag).toBe(
				'<link rel="alternate" type="application/rss+xml" title="My Blog" href="/feed.xml" />',
			);
		});

		it("escapes special characters in title", () => {
			const tag = useRssLinkTag({ title: 'Blog & "Stuff"' });
			expect(tag).toContain("Blog &amp; &quot;Stuff&quot;");
		});
	});

	describe("useCreateRssEndpoint", () => {
		it("returns a function", () => {
			const handler = useCreateRssEndpoint({
				title: "Blog",
				description: "test",
				site: "https://example.com",
				items: [],
			});
			expect(typeof handler).toBe("function");
		});

		it("returns an RSS response when called", async () => {
			const handler = useCreateRssEndpoint({
				title: "Blog",
				description: "test",
				site: "https://example.com",
				items: [
					{
						title: "Post",
						pubDate: new Date("2024-01-15"),
						link: "/post/",
					},
				],
			});

			const response = await handler({ site: "https://example.com" });
			expect(response.status).toBe(200);
			expect(response.headers.get("Content-Type")).toContain("application/xml");

			const body = await response.text();
			expect(body).toContain("<title>Blog</title>");
			expect(body).toContain("<title>Post</title>");
		});

		it("supports async item factory", async () => {
			const handler = useCreateRssEndpoint({
				title: "Blog",
				description: "test",
				site: "https://example.com",
				items: async () => [
					{
						title: "Async Post",
						pubDate: new Date("2024-01-15"),
						link: "/async/",
					},
				],
			});

			const response = await handler({ site: "https://example.com" });
			expect(response.status).toBe(200);

			const body = await response.text();
			expect(body).toContain("<title>Async Post</title>");
		});

		it("uses context.site as fallback", async () => {
			const handler = useCreateRssEndpoint({
				title: "Blog",
				description: "test",
				site: "",
				items: [
					{
						title: "Post",
						pubDate: new Date("2024-01-15"),
						link: "/post/",
					},
				],
			});

			const response = await handler({ site: "https://fallback.com" });
			expect(response.status).toBe(200);

			const body = await response.text();
			expect(body).toContain("https://fallback.com");
		});

		it("returns 500 when site is missing everywhere", async () => {
			const handler = useCreateRssEndpoint({
				title: "Blog",
				description: "test",
				site: "",
				items: [],
			});

			const response = await handler({});
			expect(response.status).toBe(500);
		});
	});

	describe("singleton", () => {
		it("returns the same instance", () => {
			const a = RssService.getInstance();
			const b = RssService.getInstance();
			expect(a).toBe(b);
		});
	});
});
