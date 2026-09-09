# Function: useUnique()

> **useUnique**&lt;`T`&gt;(`array`): `T`[]

Defined in: [src/core/services/utils.service.ts:14](https://github.com/senseikatana/katanakit-js/blob/ce5878edd9b1e40839bf178cab1449f3852fd281/src/core/services/utils.service.ts#L14)

Returns a new array with duplicate values removed, preserving first-seen order.

## Type Parameters

### T

`T`

Element type.

## Parameters

### array

`T`[]

The input array.

## Returns

`T`[]

A new array with unique values.

## Example

```ts
useUnique([1, 2, 2, 3, 1]); // [1, 2, 3]
useUnique(["a", "b", "a"]); // ["a", "b"]
```
