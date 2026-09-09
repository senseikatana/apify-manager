# Function: useToInches()

> **useToInches**(`cm`, `locale?`, `digits?`): `string`

Defined in: [src/core/services/formatter.service.ts:245](https://github.com/senseikatana/katanakit-js/blob/c7e103d8e15cf562c089e2f87844a6fd53e8dd46/src/core/services/formatter.service.ts#L245)

Pure: centimeters → inches (formatted).

## Parameters

### cm

`number`

Length in centimeters.

### locale?

[`Locale`](../type-aliases/Locale.md) = `"en"`

BCP 47 locale tag. Defaults to `"en"`.

### digits?

`number` = `2`

Fraction digits. Defaults to `2`.

## Returns

`string`

The formatted inch string.

## Example

```ts
import { useToInches } from "katanakit-js";

useToInches(2.54); // "1.00"
```
