import type { IAppUtils, IDataUtils, ISystemUtils } from "../../types/index.js";

/** Pure: unique values preserving first-seen order. */
export function useUnique<T>(array: T[]): T[] {
	return [...new Set(array)];
}

/** Pure: split an array into chunks of `size` (throws if size ≤ 0). */
export function useChunk<T>(array: T[], size: number): T[][] {
	if (size <= 0) throw new Error("Chunk size must be greater than 0");
	return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
		array.slice(i * size, i * size + size),
	);
}

/** Pure: group items by key or key selector. */
export function useGroupBy<T>(
	array: T[],
	key: keyof T | ((item: T) => string),
): Record<string, T[]> {
	return array.reduce(
		(acc, item) => {
			const groupKey: string = typeof key === "function" ? key(item) : String(item[key]);
			if (!acc[groupKey]) {
				acc[groupKey] = [];
			}
			acc[groupKey].push(item);
			return acc;
		},
		{} as Record<string, T[]>,
	);
}

/** Pure type guard: plain object (not null, not array). */
export function useIsObject(item: unknown): item is Record<string, unknown> {
	return typeof item === "object" && item !== null && !Array.isArray(item);
}

/** Pure: deep clone via `structuredClone` (JSON fallback). */
export function useDeepClone<T>(value: T): T {
	if (typeof structuredClone === "function") {
		return structuredClone(value);
	}
	return JSON.parse(JSON.stringify(value)) as T;
}

/**
 * Pure: deep-merge `source` into a shallow copy of `target`.
 * Skips prototype-pollution keys (`__proto__`, `constructor`, `prototype`).
 */
export function useDeepMerge<T extends Record<string, unknown>>(
	target: T,
	source: Record<string, unknown>,
): T {
	if (!target || !source) return { ...target };
	const output = { ...target } as Record<string, unknown>;
	const dangerousKeys = new Set(["__proto__", "constructor", "prototype"]);

	for (const key of Object.keys(source)) {
		if (dangerousKeys.has(key)) continue;

		const targetVal = target[key];
		const sourceVal = source[key];

		if (useIsObject(targetVal) && useIsObject(sourceVal)) {
			output[key] = useDeepMerge(targetVal, sourceVal);
		} else {
			output[key] = sourceVal;
		}
	}
	return output as T;
}

/** Pure: pick listed keys into a new object. */
export function usePick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
	return keys.reduce(
		(acc, key) => {
			if (key in obj) acc[key] = obj[key];
			return acc;
		},
		{} as Pick<T, K>,
	);
}

/**
 * Pure: shallow omit listed keys into a new object.
 * (Shallow on purpose — avoids `structuredClone` failures on non-cloneable values.)
 */
export function useOmit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
	const omit = new Set(keys as readonly PropertyKey[]);
	const result: Record<string, unknown> = {};
	for (const key of Object.keys(obj as object)) {
		if (!omit.has(key)) {
			result[key] = (obj as Record<string, unknown>)[key];
		}
	}
	return result as Omit<T, K>;
}

/**
 * Data utilities facade (Singleton) over pure helpers.
 * Prefer the free functions for transforms; the class remains for DI.
 */
export class DataUtils implements IDataUtils {
	private static instance: DataUtils;

	private constructor() {}

	public static getInstance(): DataUtils {
		if (!DataUtils.instance) {
			DataUtils.instance = new DataUtils();
		}
		return DataUtils.instance;
	}

	public useUnique = useUnique;
	public useChunk = useChunk;
	public useGroupBy = useGroupBy;
	public useIsObject = useIsObject;
	public useDeepClone = useDeepClone;
	public useDeepMerge = useDeepMerge;
	public usePick = usePick;
	public useOmit = useOmit;
}

/** Promise that resolves after `ms` (side-effect: timer). */
export function useSleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Retries an async function with fixed delay between attempts. */
export async function useRetry<T>(fn: () => Promise<T>, retries = 3, delayMs = 1000): Promise<T> {
	try {
		return await fn();
	} catch (error) {
		if (retries <= 0) throw error;
		await useSleep(delayMs);
		return useRetry(fn, retries - 1, delayMs);
	}
}

/** Copies text to the clipboard (browser); returns false on failure / SSR. */
export async function useCopyToClipboard(text: string): Promise<boolean> {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		return false;
	}
}

/** Pure: parse query params from a URL string (empty object on invalid URL). */
export function useGetUrlParams(urlString: string): Record<string, string> {
	try {
		const url = new URL(urlString);
		return Object.fromEntries(url.searchParams.entries());
	} catch {
		return {};
	}
}

/** Pure: round a number (or numeric string) to `decimals` places. */
export function useRound(value: string | number, decimals = 2): number {
	const num = typeof value === "string" ? Number.parseFloat(value) : value;
	if (Number.isNaN(num)) return 0;
	const factor = 10 ** decimals;
	return Math.round(num * factor) / factor;
}

/** Pure: arithmetic mean (0 for empty input). */
export function useAverage(numbers: number[]): number {
	if (numbers.length === 0) return 0;
	const sum = numbers.reduce((acc, n) => acc + n, 0);
	return sum / numbers.length;
}

/**
 * System utilities facade (Singleton) over helpers.
 */
export class SystemUtils implements ISystemUtils {
	private static instance: SystemUtils;

	private constructor() {}

	public static getInstance(): SystemUtils {
		if (!SystemUtils.instance) {
			SystemUtils.instance = new SystemUtils();
		}
		return SystemUtils.instance;
	}

	public useSleep = useSleep;
	public useRetry = useRetry;
	public useCopyToClipboard = useCopyToClipboard;
	public useGetUrlParams = useGetUrlParams;
	public useRound = useRound;
	public useAverage = useAverage;
}

/**
 * Main facade composing data and system utilities.
 */
export class AppUtils implements IAppUtils {
	private static instance: AppUtils;

	public readonly data: IDataUtils;
	public readonly system: ISystemUtils;

	private constructor() {
		this.data = DataUtils.getInstance();
		this.system = SystemUtils.getInstance();
	}

	public static getInstance(): AppUtils {
		if (!AppUtils.instance) {
			AppUtils.instance = new AppUtils();
		}
		return AppUtils.instance;
	}
}
