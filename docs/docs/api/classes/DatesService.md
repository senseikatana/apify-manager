# Class: DatesService

Defined in: [src/core/services/dates.service.ts:12](https://github.com/senseikatana/katanakit-js/blob/3163abef08c959a49d8e5fdfc946044012dab465/src/core/services/dates.service.ts#L12)

Facade + Adapter + Singleton over the Temporal polyfill.

Most methods are pure transforms of their date inputs. Exceptions:
[DatesService.useNow](#usenow) / [DatesService.useNowDateTime](#usenowdatetime) / default
args on month helpers read the system clock (impure).

## Implements

- [`DatesServiceTypes`](../interfaces/DatesServiceTypes.md)

## Methods

### useAddDays()

> **useAddDays**(`date`, `days`): `string`

Defined in: [src/core/services/dates.service.ts:78](https://github.com/senseikatana/katanakit-js/blob/3163abef08c959a49d8e5fdfc946044012dab465/src/core/services/dates.service.ts#L78)

#### Parameters

##### date

`string` \| `PlainDate`

##### days

`number`

#### Returns

`string`

#### Implementation of

[`DatesServiceTypes`](../interfaces/DatesServiceTypes.md).[`useAddDays`](../interfaces/DatesServiceTypes.md#useadddays)

***

### useDiff()

> **useDiff**(`start`, `end`): `string`

Defined in: [src/core/services/dates.service.ts:28](https://github.com/senseikatana/katanakit-js/blob/3163abef08c959a49d8e5fdfc946044012dab465/src/core/services/dates.service.ts#L28)

#### Parameters

##### start

`string` \| `PlainDate`

##### end

`string` \| `PlainDate`

#### Returns

`string`

#### Implementation of

[`DatesServiceTypes`](../interfaces/DatesServiceTypes.md).[`useDiff`](../interfaces/DatesServiceTypes.md#usediff)

***

### useFirstDayOfMonth()

> **useFirstDayOfMonth**(`date?`): `string`

Defined in: [src/core/services/dates.service.ts:100](https://github.com/senseikatana/katanakit-js/blob/3163abef08c959a49d8e5fdfc946044012dab465/src/core/services/dates.service.ts#L100)

#### Parameters

##### date?

`string` \| `PlainDate`

#### Returns

`string`

#### Implementation of

[`DatesServiceTypes`](../interfaces/DatesServiceTypes.md).[`useFirstDayOfMonth`](../interfaces/DatesServiceTypes.md#usefirstdayofmonth)

***

### useFormat()

> **useFormat**(`dateInput`, `locale?`, `options?`): `string`

Defined in: [src/core/services/dates.service.ts:39](https://github.com/senseikatana/katanakit-js/blob/3163abef08c959a49d8e5fdfc946044012dab465/src/core/services/dates.service.ts#L39)

#### Parameters

##### dateInput

[`TemporalInput`](../type-aliases/TemporalInput.md)

##### locale?

[`Locale`](../type-aliases/Locale.md) = `"en"`

##### options?

`DateTimeFormatOptions` = `{}`

#### Returns

`string`

#### Implementation of

[`DatesServiceTypes`](../interfaces/DatesServiceTypes.md).[`useFormat`](../interfaces/DatesServiceTypes.md#useformat)

***

### useIsAfter()

> **useIsAfter**(`date1`, `date2`): `boolean`

Defined in: [src/core/services/dates.service.ts:95](https://github.com/senseikatana/katanakit-js/blob/3163abef08c959a49d8e5fdfc946044012dab465/src/core/services/dates.service.ts#L95)

#### Parameters

##### date1

`string` \| `PlainDate`

##### date2

`string` \| `PlainDate`

#### Returns

`boolean`

#### Implementation of

[`DatesServiceTypes`](../interfaces/DatesServiceTypes.md).[`useIsAfter`](../interfaces/DatesServiceTypes.md#useisafter)

***

### useIsBefore()

> **useIsBefore**(`date1`, `date2`): `boolean`

Defined in: [src/core/services/dates.service.ts:90](https://github.com/senseikatana/katanakit-js/blob/3163abef08c959a49d8e5fdfc946044012dab465/src/core/services/dates.service.ts#L90)

#### Parameters

##### date1

`string` \| `PlainDate`

##### date2

`string` \| `PlainDate`

#### Returns

`boolean`

#### Implementation of

[`DatesServiceTypes`](../interfaces/DatesServiceTypes.md).[`useIsBefore`](../interfaces/DatesServiceTypes.md#useisbefore)

***

### useIsEqual()

> **useIsEqual**(`date1`, `date2`): `boolean`

Defined in: [src/core/services/dates.service.ts:84](https://github.com/senseikatana/katanakit-js/blob/3163abef08c959a49d8e5fdfc946044012dab465/src/core/services/dates.service.ts#L84)

#### Parameters

##### date1

`string` \| `PlainDate`

##### date2

`string` \| `PlainDate`

#### Returns

`boolean`

#### Implementation of

[`DatesServiceTypes`](../interfaces/DatesServiceTypes.md).[`useIsEqual`](../interfaces/DatesServiceTypes.md#useisequal)

***

### useLastDayOfMonth()

> **useLastDayOfMonth**(`date?`): `string`

Defined in: [src/core/services/dates.service.ts:104](https://github.com/senseikatana/katanakit-js/blob/3163abef08c959a49d8e5fdfc946044012dab465/src/core/services/dates.service.ts#L104)

#### Parameters

##### date?

`string` \| `PlainDate`

#### Returns

`string`

#### Implementation of

[`DatesServiceTypes`](../interfaces/DatesServiceTypes.md).[`useLastDayOfMonth`](../interfaces/DatesServiceTypes.md#uselastdayofmonth)

***

### useNow()

> **useNow**(): `string`

Defined in: [src/core/services/dates.service.ts:74](https://github.com/senseikatana/katanakit-js/blob/3163abef08c959a49d8e5fdfc946044012dab465/src/core/services/dates.service.ts#L74)

#### Returns

`string`

#### Implementation of

[`DatesServiceTypes`](../interfaces/DatesServiceTypes.md).[`useNow`](../interfaces/DatesServiceTypes.md#usenow)

***

### useNowDateTime()

> **useNowDateTime**(): `string`

Defined in: [src/core/services/dates.service.ts:76](https://github.com/senseikatana/katanakit-js/blob/3163abef08c959a49d8e5fdfc946044012dab465/src/core/services/dates.service.ts#L76)

#### Returns

`string`

#### Implementation of

[`DatesServiceTypes`](../interfaces/DatesServiceTypes.md).[`useNowDateTime`](../interfaces/DatesServiceTypes.md#usenowdatetime)

***

### useSubtractDays()

> **useSubtractDays**(`date`, `days`): `string`

Defined in: [src/core/services/dates.service.ts:81](https://github.com/senseikatana/katanakit-js/blob/3163abef08c959a49d8e5fdfc946044012dab465/src/core/services/dates.service.ts#L81)

#### Parameters

##### date

`string` \| `PlainDate`

##### days

`number`

#### Returns

`string`

#### Implementation of

[`DatesServiceTypes`](../interfaces/DatesServiceTypes.md).[`useSubtractDays`](../interfaces/DatesServiceTypes.md#usesubtractdays)

***

### getInstance()

> `static` **getInstance**(): `DatesService`

Defined in: [src/core/services/dates.service.ts:17](https://github.com/senseikatana/katanakit-js/blob/3163abef08c959a49d8e5fdfc946044012dab465/src/core/services/dates.service.ts#L17)

#### Returns

`DatesService`
