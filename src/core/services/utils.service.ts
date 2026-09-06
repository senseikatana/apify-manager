import type { IAppUtils, IDataUtils, ISystemUtils } from "../../types/index.js";

/**
 * Data utilities implemented as a Singleton.
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

	public useUnique = <T>(array: T[]): T[] => [...new Set(array)];

	public useChunk = <T>(array: T[], size: number): T[][] => {
		if (size <= 0) throw new Error("Chunk size must be greater than 0");
		return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
			array.slice(i * size, i * size + size),
		);
	};

	public useGroupBy = <T>(array: T[], key: keyof T | ((item: T) => string)): Record<string, T[]> => {
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
	};

	public useIsObject = (item: unknown): item is Record<string, unknown> =>
		typeof item === "object" && item !== null && !Array.isArray(item);

	public useDeepClone = <T>(value: T): T => {
		if (typeof structuredClone === "function") {
			return structuredClone(value);
		}
		return JSON.parse(JSON.stringify(value)) as T;
	};

	public useDeepMerge = <T extends Record<string, unknown>>(
		target: T,
		source: Record<string, unknown>,
	): T => {
		if (!target || !source) return { ...target };
		const output = { ...target } as Record<string, unknown>;
		const dangerousKeys = new Set(["__proto__", "constructor", "prototype"]);

		for (const key of Object.keys(source)) {
			if (dangerousKeys.has(key)) continue;

			const targetVal = target[key];
			const sourceVal = source[key];

			if (this.useIsObject(targetVal) && this.useIsObject(sourceVal)) {
				output[key] = this.useDeepMerge(targetVal, sourceVal);
			} else {
				output[key] = sourceVal;
			}
		}
		return output as T;
	};

	public usePick = <T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
		return keys.reduce(
			(acc, key) => {
				if (key in obj) acc[key] = obj[key];
				return acc;
			},
			{} as Pick<T, K>,
		);
	};

	public useOmit = <T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
		const result = this.useDeepClone(obj) as Record<string, unknown>;
		for (const key of keys) delete result[key as string];
		return result as Omit<T, K>;
	};
}

/**
 * System utilities implemented as a Singleton.
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

	public useSleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

	public useRetry = async <T>(fn: () => Promise<T>, retries = 3, delayMs = 1000): Promise<T> => {
		try {
			return await fn();
		} catch (error) {
			if (retries <= 0) throw error;
			await this.useSleep(delayMs);
			return this.useRetry(fn, retries - 1, delayMs);
		}
	};

	public useCopyToClipboard = async (text: string): Promise<boolean> => {
		try {
			await navigator.clipboard.writeText(text);
			return true;
		} catch {
			return false;
		}
	};

	public useGetUrlParams = (urlString: string): Record<string, string> => {
		try {
			const url = new URL(urlString);
			return Object.fromEntries(url.searchParams.entries());
		} catch {
			return {};
		}
	};

	public useRound = (value: string | number, decimals = 2): number => {
		const num = typeof value === "string" ? Number.parseFloat(value) : value;
		if (Number.isNaN(num)) return 0;
		const factor = 10 ** decimals;
		return Math.round(num * factor) / factor;
	};

	public useAverage = (numbers: number[]): number => {
		if (numbers.length === 0) return 0;
		const sum = numbers.reduce((acc, n) => acc + n, 0);
		return sum / numbers.length;
	};
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

// Singleton instances and destructured exports.
export const {
	useUnique,
	useChunk,
	useGroupBy,
	useIsObject,
	useDeepClone,
	useDeepMerge,
	usePick,
	useOmit,
}: DataUtils = DataUtils.getInstance();

export const {
	useSleep,
	useRetry,
	useCopyToClipboard,
	useGetUrlParams,
	useRound,
	useAverage,
}: SystemUtils = SystemUtils.getInstance();
