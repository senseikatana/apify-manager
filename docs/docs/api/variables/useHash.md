# Variable: useHash

> **useHash**: (`plainText`, `salt?`) => `Promise`&lt;`string`&gt;

Defined in: [src/core/services/generator.service.ts:148](https://github.com/senseikatana/katanakit-js/blob/3163abef08c959a49d8e5fdfc946044012dab465/src/core/services/generator.service.ts#L148)

Derives a PBKDF2-SHA512 hash of `plainText`.
Returns `"salt:hashHex"`. Prefer a unique salt per secret.

## Parameters

### plainText

`string`

### salt?

`string`

## Returns

`Promise`&lt;`string`&gt;

## Example

```ts
import { useHash } from "katanakit-js";
const digest = await useHash("secret", "optional-salt");
// => "optional-salt:<128 hex chars>"
```
