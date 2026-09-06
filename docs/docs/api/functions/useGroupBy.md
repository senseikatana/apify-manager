# Function: useGroupBy()

> **useGroupBy**&lt;`T`&gt;(`array`, `key`): `Record`&lt;`string`, `T`[]&gt;

Defined in: [src/core/services/utils.service.ts:17](https://github.com/senseikatana/katanakit-js/blob/3163abef08c959a49d8e5fdfc946044012dab465/src/core/services/utils.service.ts#L17)

Pure: group items by key or key selector.

## Type Parameters

### T

`T`

## Parameters

### array

`T`[]

### key

keyof `T` \| ((`item`) => `string`)

## Returns

`Record`&lt;`string`, `T`[]&gt;
