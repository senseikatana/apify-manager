import type { IntervalControl, TimeoutControl } from "../../types/index.js";
import { useLogger } from "./logger.service.js";

type TimerId = ReturnType<typeof setTimeout>;

/**
 * Timing utilities: delays, debouncing, throttling and timeouts.
 * Implemented as a Singleton facade with factory methods.
 */
export default class TimingService {
	private static instance: TimingService;

	private constructor() {}

	public static getInstance(): TimingService {
		if (!TimingService.instance) {
			TimingService.instance = new TimingService();
		}
		return TimingService.instance;
	}

	public useDelay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

	/** Alias for delay, more semantic for sleep operations. */
	public useSleep = (ms: number): Promise<void> => this.useDelay(ms);

	public useSetTimeout = <T>(callback: () => T | Promise<T>, ms: number): TimeoutControl<T> => {
		let timerId: TimerId | undefined;
		let isCancelled = false;
		let rejectFn: ((reason?: unknown) => void) | undefined;

		const promise = new Promise<T>((resolve, reject) => {
			rejectFn = reject;
			timerId = setTimeout(async () => {
				if (isCancelled) return;

				try {
					const result = await callback();
					resolve(result);
				} catch (error) {
					reject(error);
				}
			}, ms);
		});

		const cancel = () => {
			if (isCancelled) return;
			isCancelled = true;
			if (timerId !== undefined) {
				clearTimeout(timerId);
			}
			rejectFn?.(new Error("Timeout cancelled"));
		};

		return { promise, cancel };
	};

	public useInterval = (
		callback: () => void | Promise<void>,
		ms: number,
		immediate = false,
	): IntervalControl => {
		let timerId: TimerId | null = null;
		let isPaused = false;
		let isStopped = false;
		let isExecuting = false;

		const execute = async () => {
			if (isPaused || isStopped || isExecuting) return;

			isExecuting = true;
			try {
				await callback();
			} catch (error) {
				useLogger("[interval] Callback error:", error, "error");
			} finally {
				isExecuting = false;
			}
		};

		const scheduleNext = () => {
			if (isStopped || isPaused) return;
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
			if (isStopped) return;
			isPaused = true;
			if (timerId) {
				clearTimeout(timerId);
				timerId = null;
			}
		};

		const resume = () => {
			if (isStopped || !isPaused) return;
			isPaused = false;
			scheduleNext();
		};

		const isRunning = () => !isStopped && !isPaused;

		if (immediate) {
			execute().then(() => scheduleNext());
		} else {
			scheduleNext();
		}

		return { pause, resume, stop, isRunning };
	};

	public useDebounce = <T extends (...args: unknown[]) => unknown>(
		func: T,
		delayMs: number,
	): ((...args: Parameters<T>) => void) => {
		let timeoutId: TimerId | undefined;

		return (...args: Parameters<T>) => {
			if (timeoutId !== undefined) {
				clearTimeout(timeoutId);
			}

			timeoutId = setTimeout(() => {
				try {
					func(...args);
				} catch (error) {
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
	public useDebounceImmediate = <T extends (...args: unknown[]) => unknown>(
		func: T,
		delayMs: number,
	): ((...args: Parameters<T>) => void) => {
		let timeoutId: TimerId | undefined;
		let invoked = false;
		let lastArgs: Parameters<T> | null = null;

		return (...args: Parameters<T>) => {
			lastArgs = args;

			if (!invoked) {
				invoked = true;
				lastArgs = null;
				try {
					func(...args);
				} catch (error) {
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
					} catch (error) {
						useLogger("[debounceImmediate] Callback error:", error, "error");
					}
				}
				invoked = false;
				lastArgs = null;
				timeoutId = undefined;
			}, delayMs);
		};
	};

	public useThrottle = <T extends (...args: unknown[]) => unknown>(
		func: T,
		limitMs: number,
	): ((...args: Parameters<T>) => void) => {
		let inThrottle = false;

		return (...args: Parameters<T>) => {
			if (!inThrottle) {
				try {
					func(...args);
				} catch (error) {
					useLogger("[throttle] Callback error:", error, "error");
				}
				inThrottle = true;
				setTimeout(() => {
					inThrottle = false;
				}, limitMs);
			}
		};
	};

	public useThrottleTrailing = <T extends (...args: unknown[]) => unknown>(
		func: T,
		limitMs: number,
	): ((...args: Parameters<T>) => void) => {
		let inThrottle = false;
		let lastArgs: Parameters<T> | null = null;

		return (...args: Parameters<T>) => {
			if (!inThrottle) {
				try {
					func(...args);
				} catch (error) {
					useLogger("[throttleTrailing] Callback error:", error, "error");
				}
				inThrottle = true;
				lastArgs = null;

				setTimeout(() => {
					inThrottle = false;
					if (lastArgs) {
						try {
							func(...lastArgs);
						} catch (error) {
							useLogger("[throttleTrailing] Callback error:", error, "error");
						}
					}
				}, limitMs);
			} else {
				lastArgs = args;
			}
		};
	};

	public useRepeat = async (
		callback: (iteration: number) => void | Promise<void>,
		iterations: number,
		delayMs = 0,
	): Promise<void> => {
		for (let i = 0; i < iterations; i++) {
			try {
				await callback(i);
			} catch (error) {
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
	public useRace = async <T>(
		promise: Promise<T>,
		timeoutMs: number,
		errorMessage = "Operation timed out",
	): Promise<T> => {
		let timeoutId: TimerId | undefined;
		let settled = false;

		const timeoutPromise = new Promise<never>((_, reject) => {
			timeoutId = setTimeout(() => {
				if (!settled) {
					reject(new Error(errorMessage));
				}
			}, timeoutMs);
		});

		try {
			return await Promise.race([promise, timeoutPromise]);
		} finally {
			settled = true;
			if (timeoutId !== undefined) {
				clearTimeout(timeoutId);
			}
		}
	};
}

// Singleton instance and destructured exports.
export const {
	useDelay,
	useSetTimeout,
	useInterval,
	useDebounce,
	useDebounceImmediate,
	useThrottle,
	useThrottleTrailing,
	useRepeat,
	useRace,
}: TimingService = TimingService.getInstance();
