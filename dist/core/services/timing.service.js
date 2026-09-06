import { useLogger } from "./logger.service.js";
/**
 * Timing utilities: delays, debouncing, throttling and timeouts.
 * Implemented as a Singleton facade with factory methods.
 */
export default class TimingService {
    static instance;
    constructor() { }
    static getInstance() {
        if (!TimingService.instance) {
            TimingService.instance = new TimingService();
        }
        return TimingService.instance;
    }
    useDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    /** Alias for delay, more semantic for sleep operations. */
    useSleep = (ms) => this.useDelay(ms);
    useSetTimeout = (callback, ms) => {
        let timerId;
        let isCancelled = false;
        let rejectFn;
        const promise = new Promise((resolve, reject) => {
            rejectFn = reject;
            timerId = setTimeout(async () => {
                if (isCancelled)
                    return;
                try {
                    const result = await callback();
                    resolve(result);
                }
                catch (error) {
                    reject(error);
                }
            }, ms);
        });
        const cancel = () => {
            if (isCancelled)
                return;
            isCancelled = true;
            if (timerId !== undefined) {
                clearTimeout(timerId);
            }
            rejectFn?.(new Error("Timeout cancelled"));
        };
        return { promise, cancel };
    };
    useInterval = (callback, ms, immediate = false) => {
        let timerId = null;
        let isPaused = false;
        let isStopped = false;
        let isExecuting = false;
        const execute = async () => {
            if (isPaused || isStopped || isExecuting)
                return;
            isExecuting = true;
            try {
                await callback();
            }
            catch (error) {
                useLogger("[interval] Callback error:", error, "error");
            }
            finally {
                isExecuting = false;
            }
        };
        const scheduleNext = () => {
            if (isStopped || isPaused)
                return;
            timerId = setTimeout(async () => {
                await execute();
                scheduleNext();
            }, ms);
        };
        const stop = () => {
            isStopped = true;
            isPaused = false;
            if (timerId) {
                clearTimeout(timerId);
                timerId = null;
            }
        };
        const pause = () => {
            if (isStopped)
                return;
            isPaused = true;
            if (timerId) {
                clearTimeout(timerId);
                timerId = null;
            }
        };
        const resume = () => {
            if (isStopped || !isPaused)
                return;
            isPaused = false;
            scheduleNext();
        };
        const isRunning = () => !isStopped && !isPaused;
        if (immediate) {
            execute().then(() => scheduleNext());
        }
        else {
            scheduleNext();
        }
        return { pause, resume, stop, isRunning };
    };
    useDebounce = (func, delayMs) => {
        let timeoutId;
        return (...args) => {
            if (timeoutId !== undefined) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                try {
                    func(...args);
                }
                catch (error) {
                    useLogger("[debounce] Callback error:", error, "error");
                }
                timeoutId = undefined;
            }, delayMs);
        };
    };
    /**
     * Leading-edge debounce: fires immediately on the first call, then ignores
     * calls until `delayMs` of quiet. Additional calls during the wait window
     * schedule a single trailing invocation with the latest arguments.
     */
    useDebounceImmediate = (func, delayMs) => {
        let timeoutId;
        let invoked = false;
        let lastArgs = null;
        return (...args) => {
            lastArgs = args;
            if (!invoked) {
                invoked = true;
                lastArgs = null;
                try {
                    func(...args);
                }
                catch (error) {
                    useLogger("[debounceImmediate] Callback error:", error, "error");
                }
            }
            if (timeoutId !== undefined) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                if (lastArgs) {
                    try {
                        func(...lastArgs);
                    }
                    catch (error) {
                        useLogger("[debounceImmediate] Callback error:", error, "error");
                    }
                }
                invoked = false;
                lastArgs = null;
                timeoutId = undefined;
            }, delayMs);
        };
    };
    useThrottle = (func, limitMs) => {
        let inThrottle = false;
        return (...args) => {
            if (!inThrottle) {
                try {
                    func(...args);
                }
                catch (error) {
                    useLogger("[throttle] Callback error:", error, "error");
                }
                inThrottle = true;
                setTimeout(() => {
                    inThrottle = false;
                }, limitMs);
            }
        };
    };
    useThrottleTrailing = (func, limitMs) => {
        let inThrottle = false;
        let lastArgs = null;
        return (...args) => {
            if (!inThrottle) {
                try {
                    func(...args);
                }
                catch (error) {
                    useLogger("[throttleTrailing] Callback error:", error, "error");
                }
                inThrottle = true;
                lastArgs = null;
                setTimeout(() => {
                    inThrottle = false;
                    if (lastArgs) {
                        try {
                            func(...lastArgs);
                        }
                        catch (error) {
                            useLogger("[throttleTrailing] Callback error:", error, "error");
                        }
                    }
                }, limitMs);
            }
            else {
                lastArgs = args;
            }
        };
    };
    useRepeat = async (callback, iterations, delayMs = 0) => {
        for (let i = 0; i < iterations; i++) {
            try {
                await callback(i);
            }
            catch (error) {
                useLogger("[repeat] Callback error:", error, "error");
            }
            if (i < iterations - 1 && delayMs > 0) {
                await this.useDelay(delayMs);
            }
        }
    };
    /**
     * Races a promise against a timeout. Clears the timer when the promise wins
     * so the timeout rejection cannot become an unhandled rejection.
     */
    useRace = async (promise, timeoutMs, errorMessage = "Operation timed out") => {
        let timeoutId;
        let settled = false;
        const timeoutPromise = new Promise((_, reject) => {
            timeoutId = setTimeout(() => {
                if (!settled) {
                    reject(new Error(errorMessage));
                }
            }, timeoutMs);
        });
        try {
            return await Promise.race([promise, timeoutPromise]);
        }
        finally {
            settled = true;
            if (timeoutId !== undefined) {
                clearTimeout(timeoutId);
            }
        }
    };
}
// Singleton instance and destructured exports.
export const { useDelay, useSetTimeout, useInterval, useDebounce, useDebounceImmediate, useThrottle, useThrottleTrailing, useRepeat, useRace, } = TimingService.getInstance();
//# sourceMappingURL=timing.service.js.map