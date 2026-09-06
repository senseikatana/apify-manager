import type { WorkerFunc } from "../../types/index.js";
/**
 * Worker facade (Singleton + Pool pattern) for running pure functions off the
 * main thread, with an SSR/main-thread fallback when Worker is unavailable.
 *
 * @example
 * ```ts
 * import WorkerService from "katanakit-js";
 * // or: import { WorkerService } from "katanakit-js";
 *
 * const workers = WorkerService.getInstance();
 *
 * // One-shot: pass a pure function + input data
 * const doubled = await workers.useRun((n: number) => n * 2, 21);
 *
 * // Pool: create once, run many times
 * workers.useCreatePool("heavy", (n: number) => n ** 2);
 * const squared = await workers.useRunPool("heavy", 9);
 * workers.useTerminate("heavy");
 * ```
 */
export default class WorkerService {
    private static instance;
    private pools;
    private constructor();
    static getInstance(): WorkerService;
    static useIsSupported(): boolean;
    /**
     * Runs a pure function in a one-shot Worker and destroys it afterwards.
     * Async worker functions are awaited (Promise resolved before postMessage).
     */
    useRun<TInput, TOutput>(workerFunc: WorkerFunc<TInput, TOutput>, data: TInput): Promise<TOutput>;
    /**
     * Creates a reusable Worker pool under a unique key.
     */
    useCreatePool<TInput, TOutput>(key: string, workerFunc: WorkerFunc<TInput, TOutput>): this;
    /**
     * Runs a task on an existing pool. Tasks are correlated by `__taskId`.
     * Errors use `addEventListener` so concurrent tasks do not stomp handlers.
     */
    useRunPool<TInput, TOutput>(key: string, data: TInput): Promise<TOutput>;
    /**
     * Terminates a specific pool and rejects any in-flight tasks.
     */
    useTerminate(key: string): this;
    /**
     * Terminates all active pools.
     */
    useTerminateAll(): this;
    /**
     * Checks whether a pool exists.
     */
    useHasWorker(key: string): boolean;
    /**
     * Lists all active pool keys.
     */
    useKeys(): string[];
}
//# sourceMappingURL=worker.service.d.ts.map