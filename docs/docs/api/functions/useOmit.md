# Function: useOmit()

> **useOmit**&lt;`T`, `K`&gt;(`obj`, `keys`): `Omit`&lt;`T`, `K`&gt;

Defined in: [src/core/services/utils.service.ts:89](https://github.com/senseikatana/katanakit-js/blob/3163abef08c959a49d8e5fdfc946044012dab465/src/core/services/utils.service.ts#L89)

Pure: shallow omit listed keys into a new object.
(Shallow on purpose — avoids `structuredClone` failures on non-cloneable values.)

## Type Parameters

### T

`T` *extends* `object`

### K

`K` *extends* `string` \| `number` \| `symbol`

## Parameters

### obj

`T`

### keys

`K`[]

## Returns

`Omit`&lt;`T`, `K`&gt;
