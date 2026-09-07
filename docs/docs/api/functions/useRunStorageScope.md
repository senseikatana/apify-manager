# Function: useRunStorageScope()

> **useRunStorageScope**&lt;`T`&gt;(`fn`): `T`

Defined in: [src/infrastructure/storage/storage.service.ts:164](https://github.com/senseikatana/katanakit-js/blob/7327444cca55df05754ea3a25325f2d544b9811c/src/infrastructure/storage/storage.service.ts#L164)

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
