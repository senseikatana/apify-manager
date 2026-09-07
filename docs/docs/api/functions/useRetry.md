# Function: useRetry()

> **useRetry**&lt;`T`&gt;(`fn`, `retries?`, `delayMs?`): `Promise`&lt;`T`&gt;

Defined in: [src/core/services/utils.service.ts:132](https://github.com/senseikatana/katanakit-js/blob/4e4c1f0ceca5dc347e3c16a4bcff846721a632f3/src/core/services/utils.service.ts#L132)

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
