import type { IAppUtils, IDataUtils, ISystemUtils } from "../../types/index.js";
/** Pure: unique values preserving first-seen order. */
export declare function useUnique<T>(array: T[]): T[];
/** Pure: split an array into chunks of `size` (throws if size ≤ 0). */
export declare function useChunk<T>(array: T[], size: number): T[][];
/** Pure: group items by key or key selector. */
export declare function useGroupBy<T>(array: T[], key: keyof T | ((item: T) => string)): Record<string, T[]>;
/** Pure type guard: plain object (not null, not array). */
export declare function useIsObject(item: unknown): item is Record<string, unknown>;
/** Pure: deep clone via `structuredClone` (JSON fallback). */
export declare function useDeepClone<T>(value: T): T;
/**
 * Pure: deep-merge `source` into a shallow copy of `target`.
 * Skips prototype-pollution keys (`__proto__`, `constructor`, `prototype`).
 */
export declare function useDeepMerge<T extends Record<string, unknown>>(target: T, source: Record<string, unknown>): T;
/** Pure: pick listed keys into a new object. */
export declare function usePick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>;
/**
 * Pure: shallow omit listed keys into a new object.
 * (Shallow on purpose — avoids `structuredClone` failures on non-cloneable values.)
 */
export declare function useOmit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>;
/**
 * Data utilities facade (Singleton) over pure helpers.
 * Prefer the free functions for transforms; the class remains for DI.
 */
export declare class DataUtils implements IDataUtils {
    private static instance;
    private constructor();
    static getInstance(): DataUtils;
    useUnique: typeof useUnique;
    useChunk: typeof useChunk;
    useGroupBy: typeof useGroupBy;
    useIsObject: typeof useIsObject;
    useDeepClone: typeof useDeepClone;
    useDeepMerge: typeof useDeepMerge;
    usePick: typeof usePick;
    useOmit: typeof useOmit;
}
/** Promise that resolves after `ms` (side-effect: timer). */
export declare function useSleep(ms: number): Promise<void>;
/** Retries an async function with fixed delay between attempts. */
export declare function useRetry<T>(fn: () => Promise<T>, retries?: number, delayMs?: number): Promise<T>;
/** Copies text to the clipboard (browser); returns false on failure / SSR. */
export declare function useCopyToClipboard(text: string): Promise<boolean>;
/** Pure: parse query params from a URL string (empty object on invalid URL). */
export declare function useGetUrlParams(urlString: string): Record<string, string>;
/** Pure: round a number (or numeric string) to `decimals` places. */
export declare function useRound(value: string | number, decimals?: number): number;
/** Pure: arithmetic mean (0 for empty input). */
export declare function useAverage(numbers: number[]): number;
/**
 * System utilities facade (Singleton) over helpers.
 */
export declare class SystemUtils implements ISystemUtils {
    private static instance;
    private constructor();
    static getInstance(): SystemUtils;
    useSleep: typeof useSleep;
    useRetry: typeof useRetry;
    useCopyToClipboard: typeof useCopyToClipboard;
    useGetUrlParams: typeof useGetUrlParams;
    useRound: typeof useRound;
    useAverage: typeof useAverage;
}
/**
 * Main facade composing data and system utilities.
 */
export declare class AppUtils implements IAppUtils {
    private static instance;
    readonly data: IDataUtils;
    readonly system: ISystemUtils;
    private constructor();
    static getInstance(): AppUtils;
}
//# sourceMappingURL=utils.service.d.ts.map