# Function: useToKilos()

> **useToKilos**(`pounds`, `locale?`, `digits?`): `string`

Defined in: [src/core/services/formatter.service.ts:283](https://github.com/senseikatana/katanakit-js/blob/c7e103d8e15cf562c089e2f87844a6fd53e8dd46/src/core/services/formatter.service.ts#L283)

Pure: pounds → kilograms (formatted).

## Parameters

### pounds

`number`

Weight in pounds.

### locale?

[`Locale`](../type-aliases/Locale.md) = `"en"`

BCP 47 locale tag. Defaults to `"en"`.

### digits?

`number` = `2`

Fraction digits. Defaults to `2`.

## Returns

`string`

The formatted kilogram string.

## Example

```ts
import { useToKilos } from "katanakit-js";

useToKilos(1); // "0.45"
```
