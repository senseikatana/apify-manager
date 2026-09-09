import type { WorkerFunc } from "../../types/index.js";
/**
 * Runs a pure function in a one-shot Worker and destroys it afterwards.
 * Falls back to running on the main thread when Workers are unavailable (SSR).
 * Async worker functions are awaited (Promise resolved before postMessage).
 *
 * @typeParam TInput - Input data type.
 * @typeParam TOutput - Output data type.
 * @param workerFunc - The pure function to execute off the main thread.
 * @param data - The input data passed to the function.
 * @returns A Promise resolving to the function's output.
 *
 * @example
 * ```ts
 * const doubled = await useRun((n: number) => n * 2, 21);
 * console.log(doubled); // 42
 * ```
 */
export declare function useRun<TInput, TOutput>(workerFunc: WorkerFunc<TInput, TOutput>, data: TInput): Promise<TOutput>;
/**
 * Creates a reusable Worker pool under a unique key. If a pool with the same
 * key already exists, it is terminated first.
 *
 * @typeParam TInput - Input data type.
 * @typeParam TOutput - Output data type.
 * @param key - A unique identifier for this pool.
 * @param workerFunc - The pure function the pool will execute.
 *
 * @example
 * ```ts
 * useCreatePool("heavy", (n: number) => n ** 2);
 * const result = await useRunPool("heavy", 9); // 81
 * useTerminate("heavy");
 * ```
 */
export declare function useCreatePool<TInput, TOutput>(key: string, workerFunc: WorkerFunc<TInput, TOutput>): void;
/**
 * Runs a task on an existing Worker pool. Tasks are correlated by `__taskId`
 * so concurrent tasks do not stomp each other's handlers.
 *
 * @typeParam TInput - Input data type.
 * @typeParam TOutput - Output data type.
 * @param key - The pool key created via {@link useCreatePool}.
 * @param data - The input data to pass to the pool's function.
 * @returns A Promise resolving to the function's output.
 * @throws {Error} If the pool does not exist.
 *
 * @example
 * ```ts
 * useCreatePool("math", (n: number) => n * 10);
 * const result = await useRunPool("math", 5); // 50
 * ```
 */
export declare function useRunPool<TInput, TOutput>(key: string, data: TInput): Promise<TOutput>;
/**
 * Terminates a specific Worker pool and rejects any in-flight tasks.
 *
 * @param key - The pool key to terminate.
 *
 * @example
 * ```ts
 * useTerminate("heavy");
 * ```
 */
export declare function useTerminate(key: string): void;
/**
 * Terminates all active Worker pools and rejects any in-flight tasks.
 *
 * @example
 * ```ts
 * useTerminateAll();
 * ```
 */
export declare function useTerminateAll(): void;
/**
 * Checks whether a Worker pool with the given key exists.
 *
 * @param key - The pool key to check.
 * @returns `true` if the pool is registered.
 */
export declare function useHasWorker(key: string): boolean;
/**
 * Returns a list of all active Worker pool keys.
 *
 * @returns An array of pool key strings.
 */
export declare function useWorkerKeys(): string[];
//# sourceMappingURL=worker.service.d.ts.map