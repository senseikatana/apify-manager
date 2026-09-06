# Function: useInitApis()

> **useInitApis**(`apis`): `void`

Defined in: [src/core/services/http.service.ts:323](https://github.com/senseikatana/katanakit-js/blob/3163abef08c959a49d8e5fdfc946044012dab465/src/core/services/http.service.ts#L323)

Registers (merges) API definitions into the client registry.

## Parameters

### apis

[`ApisConfig`](../type-aliases/ApisConfig.md)

## Returns

`void`

## Example

```ts
import { useInitApis } from "katanakit-js";

useInitApis({
  pokeapi: {
    baseUri: "https://pokeapi.co/api/v2",
    endpoints: { pokemonById: "/pokemon/:id/" },
  },
});
```
