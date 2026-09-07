# Function: useRetry()

> **useRetry**&lt;`T`&gt;(`fn`, `retries?`, `delayMs?`): `Promise`&lt;`T`&gt;

Defined in: [src/core/services/utils.service.ts:132](https://github.com/senseikatana/katanakit-js/blob/7327444cca55df05754ea3a25325f2d544b9811c/src/core/services/utils.service.ts#L132)

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
