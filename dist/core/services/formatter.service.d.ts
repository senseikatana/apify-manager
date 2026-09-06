import type { CurrencyFormatOptions, IConverterService, IFormatterService, Locale } from "../../types/index.js";
/**
 * Pure number formatter over `Intl.NumberFormat`.
 * Stateless — safe to call from any environment.
 */
export declare function useFormatNumber(value: number, locale?: Locale, digits?: number): string;
/** Pure: locale-aware upper case (trims whitespace). */
export declare function useUpperCase(text: string, locale?: Locale): string;
/** Pure: locale-aware lower case (trims whitespace). */
export declare function useLowerCase(text: string, locale?: Locale): string;
/** Pure: capitalizes the first character; leaves the rest unchanged. */
export declare function useCapitalize(text: string, locale?: Locale): string;
/**
 * Pure: formats an amount as currency.
 *
 * `taxes` accepts either a percentage (`21` → 21%) or a decimal fraction
 * (`0.21` → 21%). Values `> 1` are treated as percentages; values in `(0, 1]`
 * as fractions. Prefer an explicit fraction when you need a rate ≤ 1%.
 */
export declare function useFormatCurrency(options: CurrencyFormatOptions): string;
/** Pure: pretty-print JSON (3-space indent). */
export declare function useJsonStringify(data: unknown): string;
/** Pure: parse JSON (throws on invalid input — same as `JSON.parse`). */
export declare function useJsonParse<T = unknown>(json: string): T;
/** Pure: °F → °C (formatted). */
export declare function useToCelsius(fahrenheit: number, locale?: Locale, digits?: number): string;
/** Pure: °C → °F (formatted). */
export declare function useToFahrenheit(celsius: number, locale?: Locale, digits?: number): string;
/** Pure: miles → kilometers (formatted). Round-trips with `useToMiles`. */
export declare function useToKilometers(miles: number, locale?: Locale, digits?: number): string;
/** Pure: kilometers → miles (formatted). Round-trips with `useToKilometers`. */
export declare function useToMiles(km: number, locale?: Locale, digits?: number): string;
/** Pure: centimeters → inches (formatted). */
export declare function useToInches(cm: number, locale?: Locale, digits?: number): string;
/** Pure: inches → centimeters (formatted). */
export declare function useToCm(inches: number, locale?: Locale, digits?: number): string;
/** Pure: pounds → kilograms (formatted). */
export declare function useToKilos(pounds: number, locale?: Locale, digits?: number): string;
/** Pure: kilograms → pounds (formatted). */
export declare function useToPounds(kilos: number, locale?: Locale, digits?: number): string;
/**
 * Number/currency/string formatter facade (Singleton) over pure helpers.
 * Prefer the free functions (`useFormatNumber`, …) for tree-shaking clarity;
 * the class remains for DI / interface consumers.
 */
export declare class FormatterService implements IFormatterService {
    private static instance;
    private constructor();
    static getInstance(): FormatterService;
    useFormatNumber: typeof useFormatNumber;
    useUpperCase: typeof useUpperCase;
    useLowerCase: typeof useLowerCase;
    useCapitalize: typeof useCapitalize;
    useFormatCurrency: typeof useFormatCurrency;
    useJsonStringify: typeof useJsonStringify;
    useJsonParse: typeof useJsonParse;
}
/**
 * Unit converter facade (Singleton) over pure helpers.
 */
export declare class ConverterService implements IConverterService {
    private static instance;
    private constructor();
    static getInstance(): ConverterService;
    useToCelsius: typeof useToCelsius;
    useToFahrenheit: typeof useToFahrenheit;
    useToKilometers: typeof useToKilometers;
    useToMiles: typeof useToMiles;
    useToInches: typeof useToInches;
    useToCm: typeof useToCm;
    useToKilos: typeof useToKilos;
    useToPounds: typeof useToPounds;
}
//# sourceMappingURL=formatter.service.d.ts.map