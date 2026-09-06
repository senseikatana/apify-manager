import type {
	CurrencyFormatOptions,
	IConverterService,
	IFormatterService,
	Locale,
} from "../../types/index.js";

/** International statute mile in kilometers (shared by both directions). */
const KM_PER_MILE = 1.60934;
const KG_PER_POUND = 0.453592;
const CM_PER_INCH = 2.54;

/**
 * Pure number formatter over `Intl.NumberFormat`.
 * Stateless — safe to call from any environment.
 */
export function useFormatNumber(value: number, locale: Locale = "en", digits = 2): string {
	return new Intl.NumberFormat(locale, {
		maximumFractionDigits: digits,
		minimumFractionDigits: digits,
	}).format(value);
}

/** Pure: locale-aware upper case (trims whitespace). */
export function useUpperCase(text: string, locale: Locale = "en"): string {
	return text.toLocaleUpperCase(locale).trim();
}

/** Pure: locale-aware lower case (trims whitespace). */
export function useLowerCase(text: string, locale: Locale = "en"): string {
	return text.toLocaleLowerCase(locale).trim();
}

/** Pure: capitalizes the first character; leaves the rest unchanged. */
export function useCapitalize(text: string, locale: Locale = "en"): string {
	const trimmed = text.trim();
	if (!trimmed) return "";
	return trimmed.charAt(0).toLocaleUpperCase(locale) + trimmed.slice(1);
}

/**
 * Pure: formats an amount as currency.
 *
 * `taxes` accepts either a percentage (`21` → 21%) or a decimal fraction
 * (`0.21` → 21%). Values `> 1` are treated as percentages; values in `(0, 1]`
 * as fractions. Prefer an explicit fraction when you need a rate ≤ 1%.
 */
export function useFormatCurrency(options: CurrencyFormatOptions): string {
	const { amount, currency = "USD", taxes = 0, locale = "en" } = options;
	const taxRate = taxes > 1 ? taxes / 100 : taxes;
	const total = amount * (1 + taxRate);

	return new Intl.NumberFormat(locale, { style: "currency", currency }).format(total);
}

/** Pure: pretty-print JSON (3-space indent). */
export function useJsonStringify(data: unknown): string {
	return JSON.stringify(data, null, 3);
}

/** Pure: parse JSON (throws on invalid input — same as `JSON.parse`). */
export function useJsonParse<T = unknown>(json: string): T {
	return JSON.parse(json) as T;
}

/** Pure: °F → °C (formatted). */
export function useToCelsius(fahrenheit: number, locale: Locale = "en", digits = 2): string {
	return useFormatNumber((fahrenheit - 32) / 1.8, locale, digits);
}

/** Pure: °C → °F (formatted). */
export function useToFahrenheit(celsius: number, locale: Locale = "en", digits = 2): string {
	return useFormatNumber(celsius * 1.8 + 32, locale, digits);
}

/** Pure: miles → kilometers (formatted). Round-trips with `useToMiles`. */
export function useToKilometers(miles: number, locale: Locale = "en", digits = 2): string {
	return useFormatNumber(miles * KM_PER_MILE, locale, digits);
}

/** Pure: kilometers → miles (formatted). Round-trips with `useToKilometers`. */
export function useToMiles(km: number, locale: Locale = "en", digits = 2): string {
	return useFormatNumber(km / KM_PER_MILE, locale, digits);
}

/** Pure: centimeters → inches (formatted). */
export function useToInches(cm: number, locale: Locale = "en", digits = 2): string {
	return useFormatNumber(cm / CM_PER_INCH, locale, digits);
}

/** Pure: inches → centimeters (formatted). */
export function useToCm(inches: number, locale: Locale = "en", digits = 2): string {
	return useFormatNumber(inches * CM_PER_INCH, locale, digits);
}

/** Pure: pounds → kilograms (formatted). */
export function useToKilos(pounds: number, locale: Locale = "en", digits = 2): string {
	return useFormatNumber(pounds * KG_PER_POUND, locale, digits);
}

/** Pure: kilograms → pounds (formatted). */
export function useToPounds(kilos: number, locale: Locale = "en", digits = 2): string {
	return useFormatNumber(kilos / KG_PER_POUND, locale, digits);
}

/**
 * Number/currency/string formatter facade (Singleton) over pure helpers.
 * Prefer the free functions (`useFormatNumber`, …) for tree-shaking clarity;
 * the class remains for DI / interface consumers.
 */
export class FormatterService implements IFormatterService {
	private static instance: FormatterService;

	private constructor() {}

	public static getInstance(): FormatterService {
		if (!FormatterService.instance) {
			FormatterService.instance = new FormatterService();
		}
		return FormatterService.instance;
	}

	public useFormatNumber = useFormatNumber;
	public useUpperCase = useUpperCase;
	public useLowerCase = useLowerCase;
	public useCapitalize = useCapitalize;
	public useFormatCurrency = useFormatCurrency;
	public useJsonStringify = useJsonStringify;
	public useJsonParse = useJsonParse;
}

/**
 * Unit converter facade (Singleton) over pure helpers.
 */
export class ConverterService implements IConverterService {
	private static instance: ConverterService;

	private constructor() {}

	public static getInstance(): ConverterService {
		if (!ConverterService.instance) {
			ConverterService.instance = new ConverterService();
		}
		return ConverterService.instance;
	}

	public useToCelsius = useToCelsius;
	public useToFahrenheit = useToFahrenheit;
	public useToKilometers = useToKilometers;
	public useToMiles = useToMiles;
	public useToInches = useToInches;
	public useToCm = useToCm;
	public useToKilos = useToKilos;
	public useToPounds = useToPounds;
}
