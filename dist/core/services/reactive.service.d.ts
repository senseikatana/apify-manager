import type { SignalGetter, SignalSetter, StorageTarget, Subscribable, ToggleSignalSetter } from "../../types/index.js";
/**
 * Creates a reactive signal with a getter and setter.
 *
 * The getter is callable and also exposes a `useSubscribe` method for
 * listening to value changes. The setter accepts either a direct value or
 * an updater function.
 *
 * @typeParam T - The signal value type.
 * @param initialValue - The initial value of the signal.
 * @returns A tuple of `[getter, setter]`.
 *
 * @example
 * ```ts
 * const [count, setCount] = useCreateSignal(0);
 * count(); // 0
 * setCount(1);
 * count(); // 1
 * setCount(prev => prev + 1);
 * count(); // 2
 *
 * const unsub = count.useSubscribe((newVal, oldVal) => {
 *   console.log(`${oldVal} -> ${newVal}`);
 * });
 * ```
 */
export declare function useCreateSignal<T>(initialValue: T): [SignalGetter<T>, SignalSetter<T>];
/**
 * Creates a side effect that re-runs whenever any of the provided signals
 * emit a new value. An optional cleanup function returned from the callback
 * is invoked before each re-run and on disposal.
 *
 * @param callback - Effect body. May return a cleanup function.
 * @param signals - Array of subscribable signals to react to.
 * @returns A dispose function that tears down all subscriptions and runs
 *   the final cleanup.
 *
 * @example
 * ```ts
 * const [name, setName] = useCreateSignal("world");
 * const dispose = useCreateEffect(() => {
 *   console.log(`Hello, ${name()}!`);
 *   return () => console.log("cleaning up");
 * }, [name]);
 *
 * setName("Katana"); // logs "Hello, Katana!"
 * dispose();         // logs "cleaning up"
 * ```
 */
export declare function useCreateEffect(callback: () => void | (() => void), signals: Subscribable<unknown>[]): () => void;
/**
 * Creates a memoised signal whose value is derived from a computation.
 * The computation re-runs whenever any of the provided signals change.
 *
 * @typeParam T - The computed value type.
 * @param computation - Pure function that derives the value.
 * @param signals - Signals the computation depends on.
 * @returns A read-only getter for the memoised value.
 *
 * @example
 * ```ts
 * const [a, setA] = useCreateSignal(2);
 * const [b, setB] = useCreateSignal(3);
 * const sum = useCreateMemo(() => a() + b(), [a, b]);
 * sum(); // 5
 * setA(10);
 * sum(); // 13
 * ```
 */
export declare function useCreateMemo<T>(computation: () => T, signals: Subscribable<unknown>[]): SignalGetter<T>;
/**
 * Creates a boolean toggle signal.
 *
 * @param initialValue - Starting value (defaults to `false`).
 * @returns A tuple of `[getter, { useSet, useToggle }]`.
 *
 * @example
 * ```ts
 * const [isOpen, { useSet, useToggle }] = useCreateToggle();
 * isOpen();    // false
 * useToggle();
 * isOpen();    // true
 * useSet(false);
 * isOpen();    // false
 * ```
 */
export declare function useCreateToggle(initialValue?: boolean): [SignalGetter<boolean>, ToggleSignalSetter];
/**
 * Creates a signal that persists its value to a storage backend
 * (localStorage, sessionStorage, etc.). Reads the initial value from
 * storage on creation.
 *
 * @typeParam T - The signal value type.
 * @param key - Storage key.
 * @param fallbackValue - Value used when the key is not in storage.
 * @param target - Storage backend (defaults to `"localStorage"`).
 * @returns A tuple of `[getter, setter]`. The setter writes through to
 *   storage.
 *
 * @example
 * ```ts
 * const [theme, setTheme] = useCreateStorageSignal("theme", "dark");
 * theme(); // "dark" (or whatever was stored)
 * setTheme("light"); // persists to localStorage
 * ```
 */
export declare function useCreateStorageSignal<T>(key: string, fallbackValue: T, target?: StorageTarget): [SignalGetter<T>, SignalSetter<T>];
/**
 * Creates a signal whose setter debounces writes by `delayMs` milliseconds.
 * Useful for search inputs or any value that triggers expensive work.
 *
 * @typeParam T - The signal value type.
 * @param initialValue - The initial value.
 * @param delayMs - Debounce delay in milliseconds (defaults to `300`).
 * @returns A tuple of `[getter, debouncedSetter]`. The setter exposes a
 *   `useCancel()` method to abort a pending write.
 *
 * @example
 * ```ts
 * const [query, setQuery] = useCreateDebouncedSignal("", 250);
 * setQuery("hello"); // won't update until 250ms of quiet
 * setQuery.useCancel(); // abort pending write
 * ```
 */
export declare function useCreateDebouncedSignal<T>(initialValue: T, delayMs?: number): [SignalGetter<T>, SignalSetter<T> & {
    useCancel: () => void;
}];
/**
 * Returns a batch function that defers signal notifications until the
 * callback completes. Nested calls are supported -- only the outermost
 * batch flushes the queue.
 *
 * @returns A `batch(callback)` function.
 *
 * @example
 * ```ts
 * const batch = useCreateBatch();
 * const [a, setA] = useCreateSignal(0);
 * const [b, setB] = useCreateSignal(0);
 *
 * batch(() => {
 *   setA(1);
 *   setB(2);
 *   // listeners fire only once here, not twice
 * });
 * ```
 */
export declare function useCreateBatch(): (callback: () => void) => void;
//# sourceMappingURL=reactive.service.d.ts.map