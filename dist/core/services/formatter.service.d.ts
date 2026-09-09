import type { CurrencyFormatOptions, Locale } from "../../types/index.js";
/**
 * Pure number formatter over `Intl.NumberFormat`.
 * Stateless — safe to call from any environment.
 *
 * @param value - The number to format.
 * @param locale - BCP 47 locale tag. Defaults to `"en"`.
 * @param digits - Maximum and minimum fraction digits. Defaults to `2`.
 * @returns The formatted number string.
 *
 * @example
 * ```ts
 * import { useFormatNumber } from "katanakit-js";
 *
 * useFormatNumber(1234.5, "en", 2); // "1,234.50"
 * useFormatNumber(1234.5, "de", 2); // "1.234,50"
 * ```
 */
export declare function useFormatNumber(value: number, locale?: Locale, digits?: number): string;
/**
 * Pure: locale-aware upper case (trims whitespace).
 *
 * @param text - The string to transform.
 * @param locale - BCP 47 locale tag. Defaults to `"en"`.
 * @returns The upper-cased, trimmed string.
 *
 * @example
 * ```ts
 * import { useUpperCase } from "katanakit-js";
 *
 * useUpperCase("hello"); // "HELLO"
 * useUpperCase("straße", "de"); // "STRASSE"
 * ```
 */
export declare function useUpperCase(text: string, locale?: Locale): string;
/**
 * Pure: locale-aware lower case (trims whitespace).
 *
 * @param text - The string to transform.
 * @param locale - BCP 47 locale tag. Defaults to `"en"`.
 * @returns The lower-cased, trimmed string.
 *
 * @example
 * ```ts
 * import { useLowerCase } from "katanakit-js";
 *
 * useLowerCase("HELLO"); // "hello"
 * ```
 */
export declare function useLowerCase(text: string, locale?: Locale): string;
/**
 * Pure: capitalizes the first character; leaves the rest unchanged.
 *
 * @param text - The string to capitalize.
 * @param locale - BCP 47 locale tag. Defaults to `"en"`.
 * @returns The string with its first character upper-cased.
 *
 * @example
 * ```ts
 * import { useCapitalize } from "katanakit-js";
 *
 * useCapitalize("hello world"); // "Hello world"
 * ```
 */
export declare function useCapitalize(text: string, locale?: Locale): string;
/**
 * Pure: formats an amount as currency.
 *
 * `taxes` accepts either a percentage (`21` → 21%) or a decimal fraction
 * (`0.21` → 21%). Values `> 1` are treated as percentages; values in `(0, 1]`
 * as fractions. Prefer an explicit fraction when you need a rate ≤ 1%.
 *
 * @param options - Currency formatting options.
 * @returns The formatted currency string.
 *
 * @example
 * ```ts
 * import { useFormatCurrency } from "katanakit-js";
 *
 * useFormatCurrency({ amount: 100, currency: "USD" }); // "$100.00"
 * useFormatCurrency({ amount: 100, taxes: 21 }); // "$121.00"
 * useFormatCurrency({ amount: 100, taxes: 0.21, locale: "es" }); // "121,00 €"
 * ```
 */
export declare function useFormatCurrency(options: CurrencyFormatOptions): string;
/**
 * Pure: pretty-print JSON (3-space indent).
 *
 * @param data - The value to serialize.
 * @returns The indented JSON string.
 *
 * @example
 * ```ts
 * import { useJsonStringify } from "katanakit-js";
 *
 * useJsonStringify({ a: 1 });
 * // '{\n   "a": 1\n}'
 * ```
 */
export declare function useJsonStringify(data: unknown): string;
/**
 * Pure: parse JSON (throws on invalid input — same as `JSON.parse`).
 *
 * @param json - The JSON string to parse.
 * @returns The parsed value typed as `T`.
 *
 * @example
 * ```ts
 * import { useJsonParse } from "katanakit-js";
 *
 * const obj = useJsonParse<{ a: number }>('{"a":1}');
 * // { a: 1 }
 * ```
 */
export declare function useJsonParse<T = unknown>(json: string): T;
/**
 * Pure: °F → °C (formatted).
 *
 * @param fahrenheit - Temperature in Fahrenheit.
 * @param locale - BCP 47 locale tag. Defaults to `"en"`.
 * @param digits - Fraction digits. Defaults to `2`.
 * @returns The formatted Celsius string.
 *
 * @example
 * ```ts
 * import { useToCelsius } from "katanakit-js";
 *
 * useToCelsius(212); // "100.00"
 * useToCelsius(32);  // "0.00"
 * ```
 */
export declare function useToCelsius(fahrenheit: number, locale?: Locale, digits?: number): string;
/**
 * Pure: °C → °F (formatted).
 *
 * @param celsius - Temperature in Celsius.
 * @param locale - BCP 47 locale tag. Defaults to `"en"`.
 * @param digits - Fraction digits. Defaults to `2`.
 * @returns The formatted Fahrenheit string.
 *
 * @example
 * ```ts
 * import { useToFahrenheit } from "katanakit-js";
 *
 * useToFahrenheit(100); // "212.00"
 * useToFahrenheit(0);   // "32.00"
 * ```
 */
export declare function useToFahrenheit(celsius: number, locale?: Locale, digits?: number): string;
/**
 * Pure: miles → kilometers (formatted). Round-trips with `useToMiles`.
 *
 * @param miles - Distance in miles.
 * @param locale - BCP 47 locale tag. Defaults to `"en"`.
 * @param digits - Fraction digits. Defaults to `2`.
 * @returns The formatted kilometer string.
 *
 * @example
 * ```ts
 * import { useToKilometers } from "katanakit-js";
 *
 * useToKilometers(1); // "1.61"
 * ```
 */
export declare function useToKilometers(miles: number, locale?: Locale, digits?: number): string;
/**
 * Pure: kilometers → miles (formatted). Round-trips with `useToKilometers`.
 *
 * @param km - Distance in kilometers.
 * @param locale - BCP 47 locale tag. Defaults to `"en"`.
 * @param digits - Fraction digits. Defaults to `2`.
 * @returns The formatted mile string.
 *
 * @example
 * ```ts
 * import { useToMiles } from "katanakit-js";
 *
 * useToMiles(1.60934); // "1.00"
 * ```
 */
export declare function useToMiles(km: number, locale?: Locale, digits?: number): string;
/**
 * Pure: centimeters → inches (formatted).
 *
 * @param cm - Length in centimeters.
 * @param locale - BCP 47 locale tag. Defaults to `"en"`.
 * @param digits - Fraction digits. Defaults to `2`.
 * @returns The formatted inch string.
 *
 * @example
 * ```ts
 * import { useToInches } from "katanakit-js";
 *
 * useToInches(2.54); // "1.00"
 * ```
 */
export declare function useToInches(cm: number, locale?: Locale, digits?: number): string;
/**
 * Pure: inches → centimeters (formatted).
 *
 * @param inches - Length in inches.
 * @param locale - BCP 47 locale tag. Defaults to `"en"`.
 * @param digits - Fraction digits. Defaults to `2`.
 * @returns The formatted centimeter string.
 *
 * @example
 * ```ts
 * import { useToCm } from "katanakit-js";
 *
 * useToCm(1); // "2.54"
 * ```
 */
export declare function useToCm(inches: number, locale?: Locale, digits?: number): string;
/**
 * Pure: pounds → kilograms (formatted).
 *
 * @param pounds - Weight in pounds.
 * @param locale - BCP 47 locale tag. Defaults to `"en"`.
 * @param digits - Fraction digits. Defaults to `2`.
 * @returns The formatted kilogram string.
 *
 * @example
 * ```ts
 * import { useToKilos } from "katanakit-js";
 *
 * useToKilos(1); // "0.45"
 * ```
 */
export declare function useToKilos(pounds: number, locale?: Locale, digits?: number): string;
/**
 * Pure: kilograms → pounds (formatted).
 *
 * @param kilos - Weight in kilograms.
 * @param locale - BCP 47 locale tag. Defaults to `"en"`.
 * @param digits - Fraction digits. Defaults to `2`.
 * @returns The formatted pound string.
 *
 * @example
 * ```ts
 * import { useToPounds } from "katanakit-js";
 *
 * useToPounds(1); // "2.20"
 * ```
 */
export declare function useToPounds(kilos: number, locale?: Locale, digits?: number): string;
//# sourceMappingURL=formatter.service.d.ts.map