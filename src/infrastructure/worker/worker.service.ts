import type { WorkerFunc, WorkerPoolEntry } from "../../types/index.js";

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
	private static instance: WorkerService;
	// Heterogeneous pool registry — each entry carries its own func types at runtime.
	private pools = new Map<string, WorkerPoolEntry>();

	private constructor() {}

	static getInstance(): WorkerService {
		if (!WorkerService.instance) {
			WorkerService.instance = new WorkerService();
		}
		return WorkerService.instance;
	}

	static useIsSupported(): boolean {
		return typeof window !== "undefined" && "Worker" in window;
	}

	/**
	 * Runs a pure function in a one-shot Worker and destroys it afterwards.
	 * Async worker functions are awaited (Promise resolved before postMessage).
	 */
	async useRun<TInput, TOutput>(
		workerFunc: WorkerFunc<TInput, TOutput>,
		data: TInput,
	): Promise<TOutput> {
		if (!WorkerService.useIsSupported()) {
			return Promise.resolve(workerFunc(data));
		}

		return new Promise((resolve, reject) => {
			let worker: Worker | undefined;
			let workerUrl: string | undefined;

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
				const blob = new Blob(
					[
						`self.onmessage = (e) => {
							Promise.resolve((${funcString})(e.data))
								.then((payload) => self.postMessage({ ok: true, payload }))
								.catch((err) => self.postMessage({ ok: false, error: String(err && err.message ? err.message : err) }));
						}`,
					],
					{ type: "application/javascript" },
				);
				workerUrl = URL.createObjectURL(blob);
				worker = new Worker(workerUrl);

				worker.onmessage = (event) => {
					cleanup();
					if (event.data?.ok === false) {
						reject(new Error(event.data.error ?? "Worker function failed"));
						return;
					}
					resolve(event.data?.payload as TOutput);
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
			} catch (error) {
				cleanup();
				reject(error);
			}
		});
	}

	/**
	 * Creates a reusable Worker pool under a unique key.
	 */
	useCreatePool<TInput, TOutput>(key: string, workerFunc: WorkerFunc<TInput, TOutput>): this {
		if (!WorkerService.useIsSupported()) {
			this.pools.set(key, {
				worker: null as unknown as Worker,
				workerUrl: "",
				func: workerFunc as WorkerFunc,
				pending: new Map(),
			});
			return this;
		}

		if (this.pools.has(key)) {
			this.useTerminate(key);
		}

		const funcString = workerFunc.toString();
		const blob = new Blob(
			[
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
			],
			{ type: "application/javascript" },
		);
		const workerUrl = URL.createObjectURL(blob);
		const worker = new Worker(workerUrl);

		this.pools.set(key, {
			worker,
			workerUrl,
			func: workerFunc as WorkerFunc,
			pending: new Map(),
		});
		return this;
	}

	/**
	 * Runs a task on an existing pool. Tasks are correlated by `__taskId`.
	 * Errors use `addEventListener` so concurrent tasks do not stomp handlers.
	 */
	useRunPool<TInput, TOutput>(key: string, data: TInput): Promise<TOutput> {
		const entry = this.pools.get(key) as WorkerPoolEntry<TInput, TOutput> | undefined;

		if (!entry) {
			return Promise.reject(new Error(`Worker pool "${key}" not found`));
		}

		if (!WorkerService.useIsSupported()) {
			return Promise.resolve(entry.func(data));
		}

		const taskId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

		return new Promise((resolve, reject) => {
			const onMessage = (event: MessageEvent) => {
				if (event.data?.__taskId !== taskId) return;
				cleanup();
				if (event.data.ok === false) {
					reject(new Error(event.data.error ?? "Worker function failed"));
					return;
				}
				resolve(event.data.payload as TOutput);
			};

			const onError = (error: ErrorEvent) => {
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
	 * Terminates a specific pool and rejects any in-flight tasks.
	 */
	useTerminate(key: string): this {
		const entry = this.pools.get(key);
		if (!entry) return this;

		for (const pending of entry.pending.values()) {
			pending.cleanup();
			pending.reject(new Error(`Worker pool "${key}" was terminated`));
		}
		entry.pending.clear();

		if (WorkerService.useIsSupported() && entry.worker) {
			entry.worker.terminate();
			if (entry.workerUrl) {
				URL.revokeObjectURL(entry.workerUrl);
			}
		}
		this.pools.delete(key);
		return this;
	}

	/**
	 * Terminates all active pools.
	 */
	useTerminateAll(): this {
		for (const key of this.pools.keys()) {
			this.useTerminate(key);
		}
		return this;
	}

	/**
	 * Checks whether a pool exists.
	 */
	useHasWorker(key: string): boolean {
		return this.pools.has(key);
	}

	/**
	 * Lists all active pool keys.
	 */
	useKeys(): string[] {
		return Array.from(this.pools.keys());
	}
}
