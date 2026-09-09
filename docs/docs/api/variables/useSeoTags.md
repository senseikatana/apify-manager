# ~~Variable: useSeoTags~~

> `const` **useSeoTags**: (`config`, `meta`) => [`SeoTagResult`](../type-aliases/SeoTagResult.md) = `useSeoTag`

Defined in: [src/config/seo.service.ts:119](https://github.com/senseikatana/katanakit-js/blob/c7e103d8e15cf562c089e2f87844a6fd53e8dd46/src/config/seo.service.ts#L119)

## Parameters

### config

[`SiteConfig`](../interfaces/SiteConfig.md)

### meta

[`SeoMeta`](../interfaces/SeoMeta.md)

## Returns

[`SeoTagResult`](../type-aliases/SeoTagResult.md)

## Deprecated

Prefer [useSeoMeta](../functions/useSeoMeta.md) with a unified flat object.
Legacy: `useSeoTag(siteConfig, { title, description, ... })`.

## Deprecated

Prefer [useSeoMeta](../functions/useSeoMeta.md).
