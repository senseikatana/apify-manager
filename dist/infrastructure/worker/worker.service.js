// ============================================================
// Module-level state
// ============================================================
/** Registry of reusable Worker pools keyed by string. */
const pools = new Map();
// ============================================================
// Internal helpers
// ============================================================
/**
 * Checks whether the Web Worker API is available.
 *
 * @returns `true` if `Worker` is available in the current environment.
 */
function isWorkerSupported() {
    return typeof window !== "undefined" && "Worker" in window;
}
// ============================================================
// Public API
// ============================================================
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
export async function useRun(workerFunc, data) {
    if (!isWorkerSupported()) {
        return Promise.resolve(workerFunc(data));
    }
    return new Promise((resolve, reject) => {
        let worker;
        let workerUrl;
        const cleanup = () => {
            if (worker) {
                worker.terminate();
                worker = undefined;
            }
            if (workerUrl) {
                URL.revokeObjectURL(workerUrl);
                workerUrl = undefined;
            }
        };
        try {
            const funcString = workerFunc.toString();
            const blob = new Blob([
                `self.onmessage = (e) => {
						Promise.resolve((${funcString})(e.data))
							.then((payload) => self.postMessage({ ok: true, payload }))
							.catch((err) => self.postMessage({ ok: false, error: String(err && err.message ? err.message : err) }));
					}`,
            ], { type: "application/javascript" });
            workerUrl = URL.createObjectURL(blob);
            worker = new Worker(workerUrl);
            worker.onmessage = (event) => {
                cleanup();
                if (event.data?.ok === false) {
                    reject(new Error(event.data.error ?? "Worker function failed"));
                    return;
                }
                resolve(event.data?.payload);
            };
            worker.onerror = (error) => {
                cleanup();
                reject(new Error(`Worker error: ${error.message}`));
            };
            worker.onmessageerror = () => {
                cleanup();
                reject(new Error("Worker returned a non-cloneable value."));
            };
            worker.postMessage(data);
        }
        catch (error) {
            cleanup();
            reject(error);
        }
    });
}
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
export function useCreatePool(key, workerFunc) {
    if (!isWorkerSupported()) {
        pools.set(key, {
            worker: null,
            workerUrl: "",
            func: workerFunc,
            pending: new Map(),
        });
        return;
    }
    if (pools.has(key)) {
        useTerminate(key);
    }
    const funcString = workerFunc.toString();
    const blob = new Blob([
        `self.onmessage = (e) => {
				const taskId = e.data.__taskId;
				Promise.resolve((${funcString})(e.data.payload))
					.then((payload) => self.postMessage({ __taskId: taskId, ok: true, payload }))
					.catch((err) => self.postMessage({
						__taskId: taskId,
						ok: false,
						error: String(err && err.message ? err.message : err),
					}));
			}`,
    ], { type: "application/javascript" });
    const workerUrl = URL.createObjectURL(blob);
    const worker = new Worker(workerUrl);
    pools.set(key, {
        worker,
        workerUrl,
        func: workerFunc,
        pending: new Map(),
    });
}
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
export function useRunPool(key, data) {
    const entry = pools.get(key);
    if (!entry) {
        return Promise.reject(new Error(`Worker pool "${key}" not found`));
    }
    if (!isWorkerSupported()) {
        return Promise.resolve(entry.func(data));
    }
    const taskId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    return new Promise((resolve, reject) => {
        const onMessage = (event) => {
            if (event.data?.__taskId !== taskId)
                return;
            cleanup();
            if (event.data.ok === false) {
                reject(new Error(event.data.error ?? "Worker function failed"));
                return;
            }
            resolve(event.data.payload);
        };
        const onError = (error) => {
            cleanup();
            reject(new Error(`Worker error: ${error.message}`));
        };
        const cleanup = () => {
            entry.worker.removeEventListener("message", onMessage);
            entry.worker.removeEventListener("error", onError);
            entry.pending.delete(taskId);
        };
        entry.pending.set(taskId, {
            reject: (reason) => reject(reason),
            cleanup,
        });
        entry.worker.addEventListener("message", onMessage);
        entry.worker.addEventListener("error", onError);
        entry.worker.postMessage({ __taskId: taskId, payload: data });
    });
}
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
export function useTerminate(key) {
    const entry = pools.get(key);
    if (!entry)
        return;
    for (const pending of entry.pending.values()) {
        pending.cleanup();
        pending.reject(new Error(`Worker pool "${key}" was terminated`));
    }
    entry.pending.clear();
    if (isWorkerSupported() && entry.worker) {
        entry.worker.terminate();
        if (entry.workerUrl) {
            URL.revokeObjectURL(entry.workerUrl);
        }
    }
    pools.delete(key);
}
/**
 * Terminates all active Worker pools and rejects any in-flight tasks.
 *
 * @example
 * ```ts
 * useTerminateAll();
 * ```
 */
export function useTerminateAll() {
    for (const key of pools.keys()) {
        useTerminate(key);
    }
}
/**
 * Checks whether a Worker pool with the given key exists.
 *
 * @param key - The pool key to check.
 * @returns `true` if the pool is registered.
 */
export function useHasWorker(key) {
    return pools.has(key);
}
/**
 * Returns a list of all active Worker pool keys.
 *
 * @returns An array of pool key strings.
 */
export function useWorkerKeys() {
    return Array.from(pools.keys());
}
//# sourceMappingURL=worker.service.js.map