# Function: useBuildApiUrl()

> **useBuildApiUrl**(`apiName`, `endpointName`, `options?`): `string`

Defined in: [src/core/services/http.service.ts:363](https://github.com/senseikatana/katanakit-js/blob/3163abef08c959a49d8e5fdfc946044012dab465/src/core/services/http.service.ts#L363)

Builds a safe http(s) URL from a registered API + endpoint.

## Parameters

### apiName

`string`

### endpointName

`string`

### options?

[`UrlOptions`](../interfaces/UrlOptions.md)

## Returns

`string`

## Example

```ts
import { useBuildApiUrl } from "katanakit-js";
const url = useBuildApiUrl("pokeapi", "pokemonById", { params: { id: 25 } });
```
