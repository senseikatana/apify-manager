import type { IReactiveService, SignalGetter, SignalSetter, StorageTarget, Subscribable, ToggleSignalSetter } from "../../types/index.js";
/**
 * Minimal reactive kernel (Observer / Publisher-Subscriber) implemented as a
 * Facade + Singleton. Signals are closures with explicit dependency tracking.
 */
export default class ReactiveService implements IReactiveService {
    private static instance;
    private isBatching;
    private batchQueue;
    private constructor();
    static getInstance(): ReactiveService;
    private NOTIFY;
    useCreateSignal: <T>(initialValue: T) => [SignalGetter<T>, SignalSetter<T>];
    useCreateEffect: (callback: () => void | (() => void), signals: Subscribable<unknown>[]) => (() => void);
    useCreateMemo: <T>(computation: () => T, signals: Subscribable<unknown>[]) => SignalGetter<T>;
    useCreateToggle: (initialValue?: boolean) => [SignalGetter<boolean>, ToggleSignalSetter];
    useCreateStorageSignal: <T>(key: string, fallbackValue: T, target?: StorageTarget) => [SignalGetter<T>, SignalSetter<T>];
    useCreateDebouncedSignal: <T>(initialValue: T, delayMs?: number) => [SignalGetter<T>, SignalSetter<T> & {
        useCancel: () => void;
    }];
    useCreateBatch: () => ((callback: () => void) => void);
}
export declare const useCreateSignal: <T>(initialValue: T) => [SignalGetter<T>, SignalSetter<T>], useCreateEffect: (callback: () => void | (() => void), signals: Subscribable<unknown>[]) => (() => void), useCreateMemo: <T>(computation: () => T, signals: Subscribable<unknown>[]) => SignalGetter<T>, useCreateToggle: (initialValue?: boolean) => [SignalGetter<boolean>, ToggleSignalSetter], useCreateStorageSignal: <T>(key: string, fallbackValue: T, target?: StorageTarget) => [SignalGetter<T>, SignalSetter<T>], useCreateDebouncedSignal: <T>(initialValue: T, delayMs?: number) => [SignalGetter<T>, SignalSetter<T> & {
    useCancel: () => void;
}], useCreateBatch: () => ((callback: () => void) => void);
//# sourceMappingURL=reactive.service.d.ts.map