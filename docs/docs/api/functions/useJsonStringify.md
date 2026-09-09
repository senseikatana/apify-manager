# Function: useJsonStringify()

> **useJsonStringify**(`data`): `string`

Defined in: [src/core/services/formatter.service.ts:130](https://github.com/senseikatana/katanakit-js/blob/ce5878edd9b1e40839bf178cab1449f3852fd281/src/core/services/formatter.service.ts#L130)

Pure: pretty-print JSON (3-space indent).

## Parameters

### data

`unknown`

The value to serialize.

## Returns

`string`

The indented JSON string.

## Example

```ts
import { useJsonStringify } from "katanakit-js";

useJsonStringify({ a: 1 });
// '{\n   "a": 1\n}'
```
