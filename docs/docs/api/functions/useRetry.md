# Function: useRetry()

> **useRetry**&lt;`T`&gt;(`fn`, `retries?`, `delayMs?`): `Promise`&lt;`T`&gt;

Defined in: [src/core/services/utils.service.ts:132](https://github.com/senseikatana/katanakit-js/blob/3163abef08c959a49d8e5fdfc946044012dab465/src/core/services/utils.service.ts#L132)

Retries an async function with fixed delay between attempts.

## Type Parameters

### T

`T`

## Parameters

### fn

() => `Promise`&lt;`T`&gt;

### retries?

`number` = `3`

### delayMs?

`number` = `1000`

## Returns

`Promise`&lt;`T`&gt;
