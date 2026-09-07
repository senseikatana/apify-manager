# Function: useOmit()

> **useOmit**&lt;`T`, `K`&gt;(`obj`, `keys`): `Omit`&lt;`T`, `K`&gt;

Defined in: [src/core/services/utils.service.ts:89](https://github.com/senseikatana/katanakit-js/blob/7327444cca55df05754ea3a25325f2d544b9811c/src/core/services/utils.service.ts#L89)

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
