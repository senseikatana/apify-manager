# Function: useRunStorageScope()

> **useRunStorageScope**&lt;`T`&gt;(`fn`): `T`

Defined in: [src/infrastructure/storage/storage.service.ts:164](https://github.com/senseikatana/katanakit-js/blob/4e4c1f0ceca5dc347e3c16a4bcff846721a632f3/src/infrastructure/storage/storage.service.ts#L164)

Runs `fn` with request-isolated in-memory storage (SSR).
Use this around a request handler so `useSetStorage` / `useGetStorage`
share state within the request but not across requests.

## Type Parameters

### T

`T`

## Parameters

### fn

() => `T`

## Returns

`T`

## Example

```ts
import { useRunStorageScope, useSetStorage, useGetStorage } from "katanakit-js";

export default defineEventHandler((event) => {
  return useRunStorageScope(() => {
    useSetStorage("req-id", event.context.id);
    return useGetStorage("req-id");
  });
});
```
