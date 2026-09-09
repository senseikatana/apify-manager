# Function: useToMiles()

> **useToMiles**(`km`, `locale?`, `digits?`): `string`

Defined in: [src/core/services/formatter.service.ts:226](https://github.com/senseikatana/katanakit-js/blob/c7e103d8e15cf562c089e2f87844a6fd53e8dd46/src/core/services/formatter.service.ts#L226)

Pure: kilometers → miles (formatted). Round-trips with `useToKilometers`.

## Parameters

### km

`number`

Distance in kilometers.

### locale?

[`Locale`](../type-aliases/Locale.md) = `"en"`

BCP 47 locale tag. Defaults to `"en"`.

### digits?

`number` = `2`

Fraction digits. Defaults to `2`.

## Returns

`string`

The formatted mile string.

## Example

```ts
import { useToMiles } from "katanakit-js";

useToMiles(1.60934); // "1.00"
```
