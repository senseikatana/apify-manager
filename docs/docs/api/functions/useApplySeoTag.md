# Function: useApplySeoTag()

> **useApplySeoTag**(`seo`, `head?`): `void`

Defined in: [src/config/seo.service.ts:187](https://github.com/senseikatana/katanakit-js/blob/3163abef08c959a49d8e5fdfc946044012dab465/src/config/seo.service.ts#L187)

Applies tags from a [SeoTagResult](../type-aliases/SeoTagResult.md) into `document.head` (Vanilla / SPA).
No-op when `document` is unavailable (SSR).

## Parameters

### seo

[`SeoTagResult`](../type-aliases/SeoTagResult.md)

### head?

`ParentNode` \| `null`

## Returns

`void`
