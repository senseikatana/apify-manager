import { useGetStorage, useSetStorage } from "../../infrastructure/storage/storage.service.js";
import { useLog } from "./logger.service.js";
/**
 * Minimal reactive kernel (Observer / Publisher-Subscriber) implemented as a
 * Facade + Singleton. Signals are closures with explicit dependency tracking.
 */
export default class ReactiveService {
    static instance;
    isBatching = false;
    batchQueue = new Set();
    constructor() { }
    static getInstance() {
        if (!ReactiveService.instance) {
            ReactiveService.instance = new ReactiveService();
        }
        return ReactiveService.instance;
    }
    NOTIFY = (notifyFn) => {
        if (this.isBatching) {
            this.batchQueue.add(notifyFn);
        }
        else {
            notifyFn();
        }
    };
    useCreateSignal = (initialValue) => {
        let value = initialValue;
        const listeners = new Set();
        const get = (() => value);
        const set = (nextValue) => {
            const oldValue = value;
            value = typeof nextValue === "function" ? nextValue(oldValue) : nextValue;
            if (value !== oldValue) {
                this.NOTIFY(() => {
                    for (const listener of listeners) {
                        try {
                            listener(value, oldValue);
                        }
                        catch (error) {
                            useLog("error", "[createSignal] Listener error:", error);
                        }
                    }
                });
            }
        };
        get.useSubscribe = (listener) => {
            listeners.add(listener);
            return () => {
                listeners.delete(listener);
            };
        };
        return [get, set];
    };
    useCreateEffect = (callback, signals) => {
        let cleanup;
        const execute = () => {
            if (typeof cleanup === "function") {
                try {
                    cleanup();
                }
                catch (error) {
                    useLog("error", "[createEffect] Previous cleanup error:", error);
                }
            }
            try {
                cleanup = callback();
            }
            catch (error) {
                useLog("error", "[createEffect] Effect execution error:", error);
            }
        };
        const unsubscribes = signals.map((signal) => {
            if (signal && typeof signal.useSubscribe === "function") {
                return signal.useSubscribe(execute);
            }
            return () => { };
        });
        execute();
        return () => {
            if (typeof cleanup === "function") {
                try {
                    cleanup();
                }
                catch (error) {
                    useLog("error", "[createEffect] Final cleanup error:", error);
                }
            }
            for (const unsub of unsubscribes) {
                unsub();
            }
        };
    };
    useCreateMemo = (computation, signals) => {
        const [get, set] = this.useCreateSignal(computation());
        this.useCreateEffect(() => {
            set(computation());
        }, signals);
        return get;
    };
    useCreateToggle = (initialValue = false) => {
        const [get, set] = this.useCreateSignal(initialValue);
        const toggle = () => set((prev) => !prev);
        return [get, { useSet: set, useToggle: toggle }];
    };
    useCreateStorageSignal = (key, fallbackValue, target = "localStorage") => {
        let initial = fallbackValue;
        try {
            const stored = useGetStorage(key, target);
            if (stored !== null && stored !== undefined) {
                initial = stored;
            }
        }
        catch (error) {
            useLog("error", `[createStorageSignal] Error reading from ${target}:`, error);
        }
        const [get, set] = this.useCreateSignal(initial);
        const setWithStorage = (nextValue) => {
            set((prev) => {
                const newValue = typeof nextValue === "function" ? nextValue(prev) : nextValue;
                try {
                    useSetStorage(key, newValue, target);
                }
                catch (error) {
                    useLog("error", `[createStorageSignal] Error writing to ${target}:`, error);
                }
                return newValue;
            });
        };
        return [get, setWithStorage];
    };
    useCreateDebouncedSignal = (initialValue, delayMs = 300) => {
        const [get, set] = this.useCreateSignal(initialValue);
        let timeoutId;
        const debouncedSet = ((nextValue) => {
            if (timeoutId !== undefined) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                set(nextValue);
                timeoutId = undefined;
            }, delayMs);
        });
        debouncedSet.useCancel = () => {
            if (timeoutId !== undefined) {
                clearTimeout(timeoutId);
                timeoutId = undefined;
            }
        };
        return [get, debouncedSet];
    };
    useCreateBatch = () => {
        return (callback) => {
            const wasBatching = this.isBatching;
            this.isBatching = true;
            try {
                callback();
            }
            catch (error) {
                useLog("error", "[createBatch] Batch block error:", error);
            }
            finally {
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
export const { useCreateSignal, useCreateEffect, useCreateMemo, useCreateToggle, useCreateStorageSignal, useCreateDebouncedSignal, useCreateBatch, } = ReactiveService.getInstance();
//# sourceMappingURL=reactive.service.js.map