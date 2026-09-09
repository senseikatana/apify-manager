import type { IntervalControl, TimeoutControl } from "../../types/index.js";
/**
 * Executes a callback after `ms` milliseconds, returning a cancellable
 * promise that resolves with the callback's result.
 *
 * @typeParam T - The callback's return type.
 * @param callback - Function to execute after the delay.
 * @param ms - Delay in milliseconds.
 * @returns A `TimeoutControl` with `promise` and `cancel()`.
 *
 * @example
 * ```ts
 * const { promise, cancel } = useSetTimeout(() => 42, 1000);
 * cancel(); // rejects the promise with "Timeout cancelled"
 * ```
 */
export declare function useSetTimeout<T>(callback: () => T | Promise<T>, ms: number): TimeoutControl<T>;
/**
 * Repeatedly executes a callback at `ms` intervals with pause/resume/stop
 * controls. Uses recursive `setTimeout` internally to avoid overlap.
 *
 * @param callback - Function executed on each tick.
 * @param ms - Interval in milliseconds.
 * @param immediate - If `true`, fires the callback immediately before the
 *   first interval (defaults to `false`).
 * @returns An `IntervalControl` with `pause`, `resume`, `stop`, and
 *   `isRunning`.
 *
 * @example
 * ```ts
 * const timer = useInterval(() => console.log("tick"), 1000);
 * setTimeout(() => timer.pause(), 3000);
 * setTimeout(() => timer.resume(), 5000);
 * setTimeout(() => timer.stop(), 10000);
 * ```
 */
export declare function useInterval(callback: () => void | Promise<void>, ms: number, immediate?: boolean): IntervalControl;
/**
 * Returns a debounced version of `func` that delays invocation until
 * `delayMs` milliseconds of quiet.
 *
 * @typeParam T - The wrapped function type.
 * @param func - Function to debounce.
 * @param delayMs - Debounce delay in milliseconds.
 * @returns A debounced function with the same signature.
 *
 * @example
 * ```ts
 * const debouncedSearch = useDebounce(fetchResults, 300);
 * input.addEventListener("input", () => debouncedSearch(input.value));
 * ```
 */
export declare function useDebounce<T extends (...args: unknown[]) => unknown>(func: T, delayMs: number): (...args: Parameters<T>) => void;
/**
 * Leading-edge debounce: fires immediately on the first call, then ignores
 * calls until `delayMs` of quiet. Additional calls during the wait window
 * schedule a single trailing invocation with the latest arguments.
 *
 * @typeParam T - The wrapped function type.
 * @param func - Function to debounce.
 * @param delayMs - Debounce delay in milliseconds.
 * @returns A debounced function with the same signature.
 *
 * @example
 * ```ts
 * const save = useDebounceImmediate(submitForm, 500);
 * save("a"); // fires immediately
 * save("b"); // queued
 * save("c"); // queued (replaces "b")
 * // after 500ms of quiet: fires with "c"
 * ```
 */
export declare function useDebounceImmediate<T extends (...args: unknown[]) => unknown>(func: T, delayMs: number): (...args: Parameters<T>) => void;
/**
 * Returns a throttled version of `func` that fires at most once per
 * `limitMs` milliseconds (leading edge).
 *
 * @typeParam T - The wrapped function type.
 * @param func - Function to throttle.
 * @param limitMs - Minimum interval between invocations in milliseconds.
 * @returns A throttled function with the same signature.
 *
 * @example
 * ```ts
 * const throttledScroll = useThrottle(onScroll, 100);
 * window.addEventListener("scroll", throttledScroll);
 * ```
 */
export declare function useThrottle<T extends (...args: unknown[]) => unknown>(func: T, limitMs: number): (...args: Parameters<T>) => void;
/**
 * Throttle with trailing invocation: fires on the leading edge and also
 * fires once at the end of the throttle window with the latest arguments.
 *
 * @typeParam T - The wrapped function type.
 * @param func - Function to throttle.
 * @param limitMs - Minimum interval between invocations in milliseconds.
 * @returns A throttled function with the same signature.
 *
 * @example
 * ```ts
 * const throttledResize = useThrottleTrailing(onResize, 200);
 * window.addEventListener("resize", throttledResize);
 * ```
 */
export declare function useThrottleTrailing<T extends (...args: unknown[]) => unknown>(func: T, limitMs: number): (...args: Parameters<T>) => void;
/**
 * Executes a callback `iterations` times with an optional delay between
 * each iteration.
 *
 * @param callback - Function called on each iteration with the current
 *   index (0-based).
 * @param iterations - Number of times to repeat.
 * @param delayMs - Delay between iterations in milliseconds (defaults to
 *   `0`).
 *
 * @example
 * ```ts
 * await useRepeat((i) => console.log(`Attempt ${i + 1}`), 3, 1000);
 * // Attempt 1 ... (1s) ... Attempt 2 ... (1s) ... Attempt 3
 * ```
 */
export declare function useRepeat(callback: (iteration: number) => void | Promise<void>, iterations: number, delayMs?: number): Promise<void>;
/**
 * Races a promise against a timeout. Clears the timer when the promise
 * wins so the timeout rejection cannot become an unhandled rejection.
 *
 * @typeParam T - The promise's resolved type.
 * @param promise - The promise to race.
 * @param timeoutMs - Timeout in milliseconds.
 * @param errorMessage - Error message on timeout (defaults to
 *   `"Operation timed out"`).
 * @returns The resolved value of the promise.
 * @throws {Error} If the timeout fires first.
 *
 * @example
 * ```ts
 * try {
 *   const data = await useRace(fetch("/api"), 5000);
 * } catch (e) {
 *   console.error(e); // "Operation timed out"
 * }
 * ```
 */
export declare function useRace<T>(promise: Promise<T>, timeoutMs: number, errorMessage?: string): Promise<T>;
//# sourceMappingURL=timing.service.d.ts.map