import { useGetStorage, useSetStorage } from "../../infrastructure/storage/storage.service.js";
import type {
	IReactiveService,
	SignalGetter,
	SignalListener,
	SignalSetter,
	StorageTarget,
	Subscribable,
	ToggleSignalSetter,
} from "../../types/index.js";
import { useLogger } from "./logger.service.js";

/**
 * Minimal reactive kernel (Observer / Publisher-Subscriber) implemented as a
 * Facade + Singleton. Signals are closures with explicit dependency tracking.
 */
export default class ReactiveService implements IReactiveService {
	private static instance: ReactiveService;

	private isBatching = false;
	private batchQueue: Set<() => void> = new Set();

	private constructor() {}

	public static getInstance(): ReactiveService {
		if (!ReactiveService.instance) {
			ReactiveService.instance = new ReactiveService();
		}
		return ReactiveService.instance;
	}

	private NOTIFY = (notifyFn: () => void): void => {
		if (this.isBatching) {
			this.batchQueue.add(notifyFn);
		} else {
			notifyFn();
		}
	};

	public useCreateSignal = <T>(initialValue: T): [SignalGetter<T>, SignalSetter<T>] => {
		let value = initialValue;
		const listeners = new Set<SignalListener<T>>();

		const get = (() => value) as SignalGetter<T>;

		const set: SignalSetter<T> = (nextValue) => {
			const oldValue = value;
			value = typeof nextValue === "function" ? (nextValue as (prev: T) => T)(oldValue) : nextValue;

			if (value !== oldValue) {
				this.NOTIFY(() => {
					for (const listener of listeners) {
						try {
							listener(value, oldValue);
						} catch (error) {
							useLogger("[createSignal] Listener error:", error, "error");
						}
					}
				});
			}
		};

		get.useSubscribe = (listener: SignalListener<T>): (() => void) => {
			listeners.add(listener);
			return () => {
				listeners.delete(listener);
			};
		};

		return [get, set];
	};

	public useCreateEffect = (
		callback: () => void | (() => void),
		signals: Subscribable<unknown>[],
	): (() => void) => {
		let cleanup: void | (() => void);

		const execute = () => {
			if (typeof cleanup === "function") {
				try {
					cleanup();
				} catch (error) {
					useLogger("[createEffect] Previous cleanup error:", error, "error");
				}
			}

			try {
				cleanup = callback() as void | (() => void);
			} catch (error) {
				useLogger("[createEffect] Effect execution error:", error, "error");
			}
		};

		const unsubscribes = signals.map((signal) => {
			if (signal && typeof signal.useSubscribe === "function") {
				return signal.useSubscribe(execute);
			}
			return () => {};
		});

		execute();

		return () => {
			if (typeof cleanup === "function") {
				try {
					cleanup();
				} catch (error) {
					useLogger("[createEffect] Final cleanup error:", error, "error");
				}
			}
			for (const unsub of unsubscribes) {
				unsub();
			}
		};
	};

	public useCreateMemo = <T>(
		computation: () => T,
		signals: Subscribable<unknown>[],
	): SignalGetter<T> => {
		const [get, set] = this.useCreateSignal<T>(computation());

		this.useCreateEffect(() => {
			set(computation());
		}, signals);

		return get;
	};

	public useCreateToggle = (initialValue = false): [SignalGetter<boolean>, ToggleSignalSetter] => {
		const [get, set] = this.useCreateSignal<boolean>(initialValue);
		const toggle = () => set((prev) => !prev);

		return [get, { useSet: set, useToggle: toggle }];
	};

	public useCreateStorageSignal = <T>(
		key: string,
		fallbackValue: T,
		target: StorageTarget = "localStorage",
	): [SignalGetter<T>, SignalSetter<T>] => {
		let initial: T = fallbackValue;

		try {
			const stored = useGetStorage<T>(key, target);
			if (stored !== null && stored !== undefined) {
				initial = stored;
			}
		} catch (error) {
			useLogger(`[createStorageSignal] Error reading from ${target}:`, error, "error");
		}

		const [get, set] = this.useCreateSignal<T>(initial);

		const setWithStorage: SignalSetter<T> = (nextValue) => {
			set((prev) => {
				const newValue = typeof nextValue === "function" ? (nextValue as (p: T) => T)(prev) : nextValue;

				try {
					useSetStorage(key, newValue, target);
				} catch (error) {
					useLogger(`[createStorageSignal] Error writing to ${target}:`, error, "error");
				}

				return newValue;
			});
		};

		return [get, setWithStorage];
	};

	public useCreateDebouncedSignal = <T>(
		initialValue: T,
		delayMs = 300,
	): [SignalGetter<T>, SignalSetter<T> & { useCancel: () => void }] => {
		const [get, set] = this.useCreateSignal<T>(initialValue);
		let timeoutId: ReturnType<typeof setTimeout> | undefined;

		const debouncedSet: SignalSetter<T> & { useCancel: () => void } = ((nextValue) => {
			if (timeoutId !== undefined) {
				clearTimeout(timeoutId);
			}

			timeoutId = setTimeout(() => {
				set(nextValue);
				timeoutId = undefined;
			}, delayMs);
		}) as SignalSetter<T> & { useCancel: () => void };

		debouncedSet.useCancel = () => {
			if (timeoutId !== undefined) {
				clearTimeout(timeoutId);
				timeoutId = undefined;
			}
		};

		return [get, debouncedSet];
	};

	public useCreateBatch = (): ((callback: () => void) => void) => {
		return (callback: () => void) => {
			const wasBatching = this.isBatching;
			this.isBatching = true;
			try {
				callback();
			} catch (error) {
				useLogger("[createBatch] Batch block error:", error, "error");
			} finally {
				if (!wasBatching) {
					this.isBatching = false;
					const queue = Array.from(this.batchQueue);
					this.batchQueue.clear();
					for (const notify of queue) {
						notify();
					}
				}
			}
		};
	};
}

// Singleton instance and destructured exports.
export const {
	useCreateSignal,
	useCreateEffect,
	useCreateMemo,
	useCreateToggle,
	useCreateStorageSignal,
	useCreateDebouncedSignal,
	useCreateBatch,
}: ReactiveService = ReactiveService.getInstance();
