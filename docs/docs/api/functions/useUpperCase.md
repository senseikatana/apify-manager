# Function: useUpperCase()

> **useUpperCase**(`text`, `locale?`): `string`

Defined in: [src/core/services/formatter.service.ts:47](https://github.com/senseikatana/katanakit-js/blob/c7e103d8e15cf562c089e2f87844a6fd53e8dd46/src/core/services/formatter.service.ts#L47)

Pure: locale-aware upper case (trims whitespace).

## Parameters

### text

`string`

The string to transform.

### locale?

[`Locale`](../type-aliases/Locale.md) = `"en"`

BCP 47 locale tag. Defaults to `"en"`.

## Returns

`string`

The upper-cased, trimmed string.

## Example

```ts
import { useUpperCase } from "katanakit-js";

useUpperCase("hello"); // "HELLO"
useUpperCase("straße", "de"); // "STRASSE"
```
