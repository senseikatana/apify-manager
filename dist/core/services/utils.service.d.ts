/**
 * Returns a new array with duplicate values removed, preserving first-seen order.
 *
 * @typeParam T - Element type.
 * @param array - The input array.
 * @returns A new array with unique values.
 *
 * @example
 * ```ts
 * useUnique([1, 2, 2, 3, 1]); // [1, 2, 3]
 * useUnique(["a", "b", "a"]); // ["a", "b"]
 * ```
 */
export declare function useUnique<T>(array: T[]): T[];
/**
 * Splits an array into chunks of the given size.
 *
 * @typeParam T - Element type.
 * @param array - The input array.
 * @param size - Number of elements per chunk (must be > 0).
 * @returns An array of chunks.
 * @throws {Error} If `size` is less than or equal to 0.
 *
 * @example
 * ```ts
 * useChunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
 * useChunk(["a", "b", "c"], 1);  // [["a"], ["b"], ["c"]]
 * ```
 */
export declare function useChunk<T>(array: T[], size: number): T[][];
/**
 * Groups array items by a key property or key selector function.
 *
 * @typeParam T - Element type.
 * @param array - The input array.
 * @param key - A property name or a function that returns the group key.
 * @returns An object mapping group keys to arrays of items.
 *
 * @example
 * ```ts
 * const items = [
 *   { type: "fruit", name: "apple" },
 *   { type: "veggie", name: "carrot" },
 *   { type: "fruit", name: "banana" },
 * ];
 * useGroupBy(items, "type");
 * // { fruit: [{ type: "fruit", name: "apple" }, { type: "fruit", name: "banana" }], veggie: [...] }
 *
 * useGroupBy(items, (item) => item.type.toUpperCase());
 * // { FRUIT: [...], VEGGIE: [...] }
 * ```
 */
export declare function useGroupBy<T>(array: T[], key: keyof T | ((item: T) => string)): Record<string, T[]>;
/**
 * Type guard that checks whether a value is a plain object (not null, not
 * an array).
 *
 * @param item - The value to test.
 * @returns `true` if the value is a plain `Record<string, unknown>`.
 *
 * @example
 * ```ts
 * useIsObject({ a: 1 });       // true
 * useIsObject([1, 2]);          // false
 * useIsObject(null);            // false
 * useIsObject("hello");         // false
 * ```
 */
export declare function useIsObject(item: unknown): item is Record<string, unknown>;
/**
 * Deep clones a value using `structuredClone` with a JSON fallback for
 * environments that do not support it.
 *
 * @typeParam T - Value type.
 * @param value - The value to clone.
 * @returns A deep copy of the value.
 *
 * @example
 * ```ts
 * const original = { a: { b: 1 } };
 * const copy = useDeepClone(original);
 * copy.a.b = 2;
 * original.a.b; // 1 (unchanged)
 * ```
 */
export declare function useDeepClone<T>(value: T): T;
/**
 * Deep merges `source` into a shallow copy of `target`. Nested plain
 * objects are merged recursively. Skips prototype-pollution keys
 * (`__proto__`, `constructor`, `prototype`).
 *
 * @typeParam T - Target object type.
 * @param target - The base object (not mutated).
 * @param source - The object to merge in.
 * @returns A new merged object.
 *
 * @example
 * ```ts
 * const base = { a: 1, b: { c: 2, d: 3 } };
 * const override = { b: { c: 99, e: 4 }, f: 5 };
 * useDeepMerge(base, override);
 * // { a: 1, b: { c: 99, d: 3, e: 4 }, f: 5 }
 * ```
 */
export declare function useDeepMerge<T extends Record<string, unknown>>(target: T, source: Record<string, unknown>): T;
/**
 * Picks the listed keys from an object into a new object.
 *
 * @typeParam T - Source object type.
 * @typeParam K - Keys to pick.
 * @param obj - The source object.
 * @param keys - Array of keys to include.
 * @returns A new object with only the picked keys.
 *
 * @example
 * ```ts
 * const user = { id: 1, name: "Alice", email: "a@b.com" };
 * usePick(user, ["id", "name"]); // { id: 1, name: "Alice" }
 * ```
 */
export declare function usePick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>;
/**
 * Omits the listed keys from an object, returning a shallow copy without
 * them. Shallow on purpose to avoid `structuredClone` failures on
 * non-cloneable values.
 *
 * @typeParam T - Source object type.
 * @typeParam K - Keys to omit.
 * @param obj - The source object.
 * @param keys - Array of keys to exclude.
 * @returns A new object without the omitted keys.
 *
 * @example
 * ```ts
 * const user = { id: 1, name: "Alice", password: "secret" };
 * useOmit(user, ["password"]); // { id: 1, name: "Alice" }
 * ```
 */
export declare function useOmit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>;
/**
 * Returns a promise that resolves after `ms` milliseconds.
 *
 * @param ms - Delay in milliseconds.
 * @returns A promise that resolves after the delay.
 *
 * @example
 * ```ts
 * await useSleep(1000); // waits 1 second
 * console.log("done");
 * ```
 */
export declare function useSleep(ms: number): Promise<void>;
/**
 * Retries an async function with a fixed delay between attempts.
 *
 * @typeParam T - The resolved value type.
 * @param fn - The async function to retry.
 * @param retries - Maximum number of retries (defaults to `3`).
 * @param delayMs - Delay between retries in milliseconds (defaults to `1000`).
 * @returns The resolved value of `fn`.
 * @throws The last error if all retries are exhausted.
 *
 * @example
 * ```ts
 * const data = await useRetry(() => fetch("/api").then(r => r.json()), 3, 500);
 * ```
 */
export declare function useRetry<T>(fn: () => Promise<T>, retries?: number, delayMs?: number): Promise<T>;
/**
 * Copies text to the clipboard (browser only). Returns `false` on failure
 * or in non-browser environments (SSR).
 *
 * @param text - The text to copy.
 * @returns `true` if the text was copied, `false` otherwise.
 *
 * @example
 * ```ts
 * const ok = await useCopyToClipboard("Hello, world!");
 * console.log(ok); // true (in a browser with clipboard API)
 * ```
 */
export declare function useCopyToClipboard(text: string): Promise<boolean>;
/**
 * Parses query parameters from a URL string into a plain object.
 * Returns an empty object for invalid URLs.
 *
 * @param urlString - The URL to parse.
 * @returns An object mapping parameter names to values.
 *
 * @example
 * ```ts
 * useGetUrlParams("https://example.com?q=hello&page=1");
 * // { q: "hello", page: "1" }
 *
 * useGetUrlParams("not-a-url"); // {}
 * ```
 */
export declare function useGetUrlParams(urlString: string): Record<string, string>;
/**
 * Rounds a number (or numeric string) to the specified number of decimal
 * places. Returns `0` for non-numeric input.
 *
 * @param value - The number or numeric string to round.
 * @param decimals - Number of decimal places (defaults to `2`).
 * @returns The rounded number.
 *
 * @example
 * ```ts
 * useRound(3.14159, 2);   // 3.14
 * useRound("5.678", 1);   // 5.7
 * useRound("not-a-num");   // 0
 * ```
 */
export declare function useRound(value: string | number, decimals?: number): number;
/**
 * Computes the arithmetic mean of an array of numbers. Returns `0` for an
 * empty array.
 *
 * @param numbers - The input numbers.
 * @returns The arithmetic mean.
 *
 * @example
 * ```ts
 * useAverage([1, 2, 3, 4, 5]); // 3
 * useAverage([]);               // 0
 * ```
 */
export declare function useAverage(numbers: number[]): number;
//# sourceMappingURL=utils.service.d.ts.map