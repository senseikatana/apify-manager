# Function: useDeepMerge()

> **useDeepMerge**&lt;`T`&gt;(`target`, `source`): `T`

Defined in: [src/core/services/utils.service.ts:51](https://github.com/senseikatana/katanakit-js/blob/3163abef08c959a49d8e5fdfc946044012dab465/src/core/services/utils.service.ts#L51)

Pure: deep-merge `source` into a shallow copy of `target`.
Skips prototype-pollution keys (`__proto__`, `constructor`, `prototype`).

## Type Parameters

### T

`T` *extends* `Record`&lt;`string`, `unknown`&gt;

## Parameters

### target

`T`

### source

`Record`&lt;`string`, `unknown`&gt;

## Returns

`T`
