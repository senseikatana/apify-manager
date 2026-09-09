# Function: useSleep()

> **useSleep**(`ms`): `Promise`&lt;`void`&gt;

Defined in: [src/core/services/utils.service.ts:227](https://github.com/senseikatana/katanakit-js/blob/583f163722c75b0302ed6af94980486c31644409/src/core/services/utils.service.ts#L227)

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
