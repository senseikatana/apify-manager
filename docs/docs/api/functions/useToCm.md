# Function: useToCm()

> **useToCm**(`inches`, `locale?`, `digits?`): `string`

Defined in: [src/core/services/formatter.service.ts:264](https://github.com/senseikatana/katanakit-js/blob/c7e103d8e15cf562c089e2f87844a6fd53e8dd46/src/core/services/formatter.service.ts#L264)

Pure: inches → centimeters (formatted).

## Parameters

### inches

`number`

Length in inches.

### locale?

[`Locale`](../type-aliases/Locale.md) = `"en"`

BCP 47 locale tag. Defaults to `"en"`.

### digits?

`number` = `2`

Fraction digits. Defaults to `2`.

## Returns

`string`

The formatted centimeter string.

## Example

```ts
import { useToCm } from "katanakit-js";

useToCm(1); // "2.54"
```
