/** International statute mile in kilometers (shared by both directions). */
const KM_PER_MILE = 1.60934;
const KG_PER_POUND = 0.453592;
const CM_PER_INCH = 2.54;
/**
 * Pure number formatter over `Intl.NumberFormat`.
 * Stateless — safe to call from any environment.
 */
export function useFormatNumber(value, locale = "en", digits = 2) {
    return new Intl.NumberFormat(locale, {
        maximumFractionDigits: digits,
        minimumFractionDigits: digits,
    }).format(value);
}
/** Pure: locale-aware upper case (trims whitespace). */
export function useUpperCase(text, locale = "en") {
    return text.toLocaleUpperCase(locale).trim();
}
/** Pure: locale-aware lower case (trims whitespace). */
export function useLowerCase(text, locale = "en") {
    return text.toLocaleLowerCase(locale).trim();
}
/** Pure: capitalizes the first character; leaves the rest unchanged. */
export function useCapitalize(text, locale = "en") {
    const trimmed = text.trim();
    if (!trimmed)
        return "";
    return trimmed.charAt(0).toLocaleUpperCase(locale) + trimmed.slice(1);
}
/**
 * Pure: formats an amount as currency.
 *
 * `taxes` accepts either a percentage (`21` → 21%) or a decimal fraction
 * (`0.21` → 21%). Values `> 1` are treated as percentages; values in `(0, 1]`
 * as fractions. Prefer an explicit fraction when you need a rate ≤ 1%.
 */
export function useFormatCurrency(options) {
    const { amount, currency = "USD", taxes = 0, locale = "en" } = options;
    const taxRate = taxes > 1 ? taxes / 100 : taxes;
    const total = amount * (1 + taxRate);
    return new Intl.NumberFormat(locale, { style: "currency", currency }).format(total);
}
/** Pure: pretty-print JSON (3-space indent). */
export function useJsonStringify(data) {
    return JSON.stringify(data, null, 3);
}
/** Pure: parse JSON (throws on invalid input — same as `JSON.parse`). */
export function useJsonParse(json) {
    return JSON.parse(json);
}
/** Pure: °F → °C (formatted). */
export function useToCelsius(fahrenheit, locale = "en", digits = 2) {
    return useFormatNumber((fahrenheit - 32) / 1.8, locale, digits);
}
/** Pure: °C → °F (formatted). */
export function useToFahrenheit(celsius, locale = "en", digits = 2) {
    return useFormatNumber(celsius * 1.8 + 32, locale, digits);
}
/** Pure: miles → kilometers (formatted). Round-trips with `useToMiles`. */
export function useToKilometers(miles, locale = "en", digits = 2) {
    return useFormatNumber(miles * KM_PER_MILE, locale, digits);
}
/** Pure: kilometers → miles (formatted). Round-trips with `useToKilometers`. */
export function useToMiles(km, locale = "en", digits = 2) {
    return useFormatNumber(km / KM_PER_MILE, locale, digits);
}
/** Pure: centimeters → inches (formatted). */
export function useToInches(cm, locale = "en", digits = 2) {
    return useFormatNumber(cm / CM_PER_INCH, locale, digits);
}
/** Pure: inches → centimeters (formatted). */
export function useToCm(inches, locale = "en", digits = 2) {
    return useFormatNumber(inches * CM_PER_INCH, locale, digits);
}
/** Pure: pounds → kilograms (formatted). */
export function useToKilos(pounds, locale = "en", digits = 2) {
    return useFormatNumber(pounds * KG_PER_POUND, locale, digits);
}
/** Pure: kilograms → pounds (formatted). */
export function useToPounds(kilos, locale = "en", digits = 2) {
    return useFormatNumber(kilos / KG_PER_POUND, locale, digits);
}
/**
 * Number/currency/string formatter facade (Singleton) over pure helpers.
 * Prefer the free functions (`useFormatNumber`, …) for tree-shaking clarity;
 * the class remains for DI / interface consumers.
 */
export class FormatterService {
    static instance;
    constructor() { }
    static getInstance() {
        if (!FormatterService.instance) {
            FormatterService.instance = new FormatterService();
        }
        return FormatterService.instance;
    }
    useFormatNumber = useFormatNumber;
    useUpperCase = useUpperCase;
    useLowerCase = useLowerCase;
    useCapitalize = useCapitalize;
    useFormatCurrency = useFormatCurrency;
    useJsonStringify = useJsonStringify;
    useJsonParse = useJsonParse;
}
/**
 * Unit converter facade (Singleton) over pure helpers.
 */
export class ConverterService {
    static instance;
    constructor() { }
    static getInstance() {
        if (!ConverterService.instance) {
            ConverterService.instance = new ConverterService();
        }
        return ConverterService.instance;
    }
    useToCelsius = useToCelsius;
    useToFahrenheit = useToFahrenheit;
    useToKilometers = useToKilometers;
    useToMiles = useToMiles;
    useToInches = useToInches;
    useToCm = useToCm;
    useToKilos = useToKilos;
    useToPounds = useToPounds;
}
//# sourceMappingURL=formatter.service.js.map