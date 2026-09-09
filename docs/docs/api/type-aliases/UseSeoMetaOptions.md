# Type Alias: UseSeoMetaOptions&lt;OmitKeys&gt;

> **UseSeoMetaOptions**&lt;`OmitKeys`&gt; = `Omit`&lt;[`UseSeoMetaBase`](UseSeoMetaBase.md), `OmitKeys`&gt;

Defined in: [src/config/seo-meta.types.ts:160](https://github.com/senseikatana/katanakit-js/blob/c7e103d8e15cf562c089e2f87844a6fd53e8dd46/src/config/seo-meta.types.ts#L160)

Public options for [useSeoMeta](../functions/useSeoMeta.md).
Only HTML + Open Graph (+ site fields). Omit keys you do not want in the type.

## Type Parameters

### OmitKeys

`OmitKeys` *extends* keyof [`UseSeoMetaBase`](UseSeoMetaBase.md) = `never`

## Example

```ts
// site = URL, siteTitle = brand, title = this page
useSeoMeta({
  site: "https://katanakit.dev",
  siteTitle: "KatanaKit",
  title: "Getting started", // → <title>Getting started | KatanaKit</title>
  description: "…",
  ogImage: "/og.png",
} satisfies UseSeoMetaOptions);

useSeoMeta({ title: "Home" } as UseSeoMetaOptions<"rss" | "nav">);
```
