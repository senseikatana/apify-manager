# Function: useGetApi()

> **useGetApi**&lt;`T`&gt;(`apiName`, `endpointName`, `urlOptions?`): `Promise`&lt;[`FetchResult`](../type-aliases/FetchResult.md)&lt;`T`&gt;&gt;

Defined in: [src/core/services/http.service.ts:421](https://github.com/senseikatana/katanakit-js/blob/3163abef08c959a49d8e5fdfc946044012dab465/src/core/services/http.service.ts#L421)

GET helper over a registered API endpoint.

## Type Parameters

### T

`T` = `unknown`

## Parameters

### apiName

`string`

### endpointName

`string`

### urlOptions?

[`UrlOptions`](../interfaces/UrlOptions.md)

## Returns

`Promise`&lt;[`FetchResult`](../type-aliases/FetchResult.md)&lt;`T`&gt;&gt;

## Example

```ts
import { useGetApi } from "katanakit-js";
const result = await useGetApi<{ name: string }>("pokeapi", "pokemonById", {
  params: { id: 25 },
});
```
