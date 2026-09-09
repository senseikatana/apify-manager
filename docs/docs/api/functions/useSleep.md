# Function: useSleep()

> **useSleep**(`ms`): `Promise`&lt;`void`&gt;

Defined in: [src/core/services/utils.service.ts:227](https://github.com/senseikatana/katanakit-js/blob/ce5878edd9b1e40839bf178cab1449f3852fd281/src/core/services/utils.service.ts#L227)

Returns a promise that resolves after `ms` milliseconds.

## Parameters

### ms

`number`

Delay in milliseconds.

## Returns

`Promise`&lt;`void`&gt;

A promise that resolves after the delay.

## Example

```ts
await useSleep(1000); // waits 1 second
console.log("done");
```
