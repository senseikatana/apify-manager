/** Pure: unique values preserving first-seen order. */
export function useUnique(array) {
    return [...new Set(array)];
}
/** Pure: split an array into chunks of `size` (throws if size ≤ 0). */
export function useChunk(array, size) {
    if (size <= 0)
        throw new Error("Chunk size must be greater than 0");
    return Array.from({ length: Math.ceil(array.length / size) }, (_, i) => array.slice(i * size, i * size + size));
}
/** Pure: group items by key or key selector. */
export function useGroupBy(array, key) {
    return array.reduce((acc, item) => {
        const groupKey = typeof key === "function" ? key(item) : String(item[key]);
        if (!acc[groupKey]) {
            acc[groupKey] = [];
        }
        acc[groupKey].push(item);
        return acc;
    }, {});
}
/** Pure type guard: plain object (not null, not array). */
export function useIsObject(item) {
    return typeof item === "object" && item !== null && !Array.isArray(item);
}
/** Pure: deep clone via `structuredClone` (JSON fallback). */
export function useDeepClone(value) {
    if (typeof structuredClone === "function") {
        return structuredClone(value);
    }
    return JSON.parse(JSON.stringify(value));
}
/**
 * Pure: deep-merge `source` into a shallow copy of `target`.
 * Skips prototype-pollution keys (`__proto__`, `constructor`, `prototype`).
 */
export function useDeepMerge(target, source) {
    if (!target || !source)
        return { ...target };
    const output = { ...target };
    const dangerousKeys = new Set(["__proto__", "constructor", "prototype"]);
    for (const key of Object.keys(source)) {
        if (dangerousKeys.has(key))
            continue;
        const targetVal = target[key];
        const sourceVal = source[key];
        if (useIsObject(targetVal) && useIsObject(sourceVal)) {
            output[key] = useDeepMerge(targetVal, sourceVal);
        }
        else {
            output[key] = sourceVal;
        }
    }
    return output;
}
/** Pure: pick listed keys into a new object. */
export function usePick(obj, keys) {
    return keys.reduce((acc, key) => {
        if (key in obj)
            acc[key] = obj[key];
        return acc;
    }, {});
}
/**
 * Pure: shallow omit listed keys into a new object.
 * (Shallow on purpose — avoids `structuredClone` failures on non-cloneable values.)
 */
export function useOmit(obj, keys) {
    const omit = new Set(keys);
    const result = {};
    for (const key of Object.keys(obj)) {
        if (!omit.has(key)) {
            result[key] = obj[key];
        }
    }
    return result;
}
/**
 * Data utilities facade (Singleton) over pure helpers.
 * Prefer the free functions for transforms; the class remains for DI.
 */
export class DataUtils {
    static instance;
    constructor() { }
    static getInstance() {
        if (!DataUtils.instance) {
            DataUtils.instance = new DataUtils();
        }
        return DataUtils.instance;
    }
    useUnique = useUnique;
    useChunk = useChunk;
    useGroupBy = useGroupBy;
    useIsObject = useIsObject;
    useDeepClone = useDeepClone;
    useDeepMerge = useDeepMerge;
    usePick = usePick;
    useOmit = useOmit;
}
/** Promise that resolves after `ms` (side-effect: timer). */
export function useSleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/** Retries an async function with fixed delay between attempts. */
export async function useRetry(fn, retries = 3, delayMs = 1000) {
    try {
        return await fn();
    }
    catch (error) {
        if (retries <= 0)
            throw error;
        await useSleep(delayMs);
        return useRetry(fn, retries - 1, delayMs);
    }
}
/** Copies text to the clipboard (browser); returns false on failure / SSR. */
export async function useCopyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    }
    catch {
        return false;
    }
}
/** Pure: parse query params from a URL string (empty object on invalid URL). */
export function useGetUrlParams(urlString) {
    try {
        const url = new URL(urlString);
        return Object.fromEntries(url.searchParams.entries());
    }
    catch {
        return {};
    }
}
/** Pure: round a number (or numeric string) to `decimals` places. */
export function useRound(value, decimals = 2) {
    const num = typeof value === "string" ? Number.parseFloat(value) : value;
    if (Number.isNaN(num))
        return 0;
    const factor = 10 ** decimals;
    return Math.round(num * factor) / factor;
}
/** Pure: arithmetic mean (0 for empty input). */
export function useAverage(numbers) {
    if (numbers.length === 0)
        return 0;
    const sum = numbers.reduce((acc, n) => acc + n, 0);
    return sum / numbers.length;
}
/**
 * System utilities facade (Singleton) over helpers.
 */
export class SystemUtils {
    static instance;
    constructor() { }
    static getInstance() {
        if (!SystemUtils.instance) {
            SystemUtils.instance = new SystemUtils();
        }
        return SystemUtils.instance;
    }
    useSleep = useSleep;
    useRetry = useRetry;
    useCopyToClipboard = useCopyToClipboard;
    useGetUrlParams = useGetUrlParams;
    useRound = useRound;
    useAverage = useAverage;
}
/**
 * Main facade composing data and system utilities.
 */
export class AppUtils {
    static instance;
    data;
    system;
    constructor() {
        this.data = DataUtils.getInstance();
        this.system = SystemUtils.getInstance();
    }
    static getInstance() {
        if (!AppUtils.instance) {
            AppUtils.instance = new AppUtils();
        }
        return AppUtils.instance;
    }
}
//# sourceMappingURL=utils.service.js.map