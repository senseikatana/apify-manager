# Function: useToFahrenheit()

> **useToFahrenheit**(`celsius`, `locale?`, `digits?`): `string`

Defined in: [src/core/services/formatter.service.ts:188](https://github.com/senseikatana/katanakit-js/blob/583f163722c75b0302ed6af94980486c31644409/src/core/services/formatter.service.ts#L188)

Pure: °C → °F (formatted).

## Parameters

### celsius

`number`

Temperature in Celsius.

### locale?

[`Locale`](../type-aliases/Locale.md) = `"en"`

BCP 47 locale tag. Defaults to `"en"`.

### digits?

`number` = `2`

Fraction digits. Defaults to `2`.

## Returns

`string`

The formatted Fahrenheit string.

## Example

```ts
import { useToFahrenheit } from "katanakit-js";

useToFahrenheit(100); // "212.00"
useToFahrenheit(0);   // "32.00"
```
