# Function: useFetchApi()

> **useFetchApi**&lt;`T`&gt;(`apiName`, `endpointName`, `options?`): `Promise`&lt;[`FetchResult`](../type-aliases/FetchResult.md)&lt;`T`&gt;&gt;

Defined in: [src/core/services/http.service.ts:391](https://github.com/senseikatana/katanakit-js/blob/3163abef08c959a49d8e5fdfc946044012dab465/src/core/services/http.service.ts#L391)

Fetches a registered endpoint and returns a Safe Result.

## Type Parameters

### T

`T` = `unknown`

## Parameters

### apiName

`string`

### endpointName

`string`

### options?

[`FetchOptions`](../interfaces/FetchOptions.md)

## Returns

`Promise`&lt;[`FetchResult`](../type-aliases/FetchResult.md)&lt;`T`&gt;&gt;

## Example

```ts
import { useFetchApi } from "katanakit-js";
const result = await useFetchApi("pokeapi", "pokemonById", {
  method: "GET",
  urlOptions: { params: { id: 25 } },
});
if (result.ok) console.log(result.data);
```
