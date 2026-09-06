# Function: useFormatCurrency()

> **useFormatCurrency**(`options`): `string`

Defined in: [src/core/services/formatter.service.ts:48](https://github.com/senseikatana/katanakit-js/blob/3163abef08c959a49d8e5fdfc946044012dab465/src/core/services/formatter.service.ts#L48)

Pure: formats an amount as currency.

`taxes` accepts either a percentage (`21` → 21%) or a decimal fraction
(`0.21` → 21%). Values `> 1` are treated as percentages; values in `(0, 1]`
as fractions. Prefer an explicit fraction when you need a rate ≤ 1%.

## Parameters

### options

[`CurrencyFormatOptions`](../interfaces/CurrencyFormatOptions.md)

## Returns

`string`
