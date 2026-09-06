import type { IntervalControl, TimeoutControl } from "../../types/index.js";
/**
 * Timing utilities: delays, debouncing, throttling and timeouts.
 * Implemented as a Singleton facade with factory methods.
 */
export default class TimingService {
    private static instance;
    private constructor();
    static getInstance(): TimingService;
    useDelay: (ms: number) => Promise<void>;
    /** Alias for delay, more semantic for sleep operations. */
    useSleep: (ms: number) => Promise<void>;
    useSetTimeout: <T>(callback: () => T | Promise<T>, ms: number) => TimeoutControl<T>;
    useInterval: (callback: () => void | Promise<void>, ms: number, immediate?: boolean) => IntervalControl;
    useDebounce: <T extends (...args: unknown[]) => unknown>(func: T, delayMs: number) => ((...args: Parameters<T>) => void);
    /**
     * Leading-edge debounce: fires immediately on the first call, then ignores
     * calls until `delayMs` of quiet. Additional calls during the wait window
     * schedule a single trailing invocation with the latest arguments.
     */
    useDebounceImmediate: <T extends (...args: unknown[]) => unknown>(func: T, delayMs: number) => ((...args: Parameters<T>) => void);
    useThrottle: <T extends (...args: unknown[]) => unknown>(func: T, limitMs: number) => ((...args: Parameters<T>) => void);
    useThrottleTrailing: <T extends (...args: unknown[]) => unknown>(func: T, limitMs: number) => ((...args: Parameters<T>) => void);
    useRepeat: (callback: (iteration: number) => void | Promise<void>, iterations: number, delayMs?: number) => Promise<void>;
    /**
     * Races a promise against a timeout. Clears the timer when the promise wins
     * so the timeout rejection cannot become an unhandled rejection.
     */
    useRace: <T>(promise: Promise<T>, timeoutMs: number, errorMessage?: string) => Promise<T>;
}
export declare const useDelay: (ms: number) => Promise<void>, useSetTimeout: <T>(callback: () => T | Promise<T>, ms: number) => TimeoutControl<T>, useInterval: (callback: () => void | Promise<void>, ms: number, immediate?: boolean) => IntervalControl, useDebounce: <T extends (...args: unknown[]) => unknown>(func: T, delayMs: number) => (...args: Parameters<T>) => void, useDebounceImmediate: <T extends (...args: unknown[]) => unknown>(func: T, delayMs: number) => (...args: Parameters<T>) => void, useThrottle: <T extends (...args: unknown[]) => unknown>(func: T, limitMs: number) => (...args: Parameters<T>) => void, useThrottleTrailing: <T extends (...args: unknown[]) => unknown>(func: T, limitMs: number) => (...args: Parameters<T>) => void, useRepeat: (callback: (iteration: number) => void | Promise<void>, iterations: number, delayMs?: number) => Promise<void>, useRace: <T>(promise: Promise<T>, timeoutMs: number, errorMessage?: string) => Promise<T>;
//# sourceMappingURL=timing.service.d.ts.map