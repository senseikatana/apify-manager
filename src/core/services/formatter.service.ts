import type {
	CurrencyFormatOptions,
	IConverterService,
	IFormatterService,
	Locale,
} from "../../types/index.js";

/**
 * Number/currency/string formatter (Adapter + Singleton) over `Intl`.
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

	public useFormatNumber = (value: number, locale: Locale = "en", digits = 2): string => {
		return new Intl.NumberFormat(locale, {
			maximumFractionDigits: digits,
			minimumFractionDigits: digits,
		}).format(value);
	};

	public useUpperCase = (text: string, locale: Locale = "en"): string =>
		text.toLocaleUpperCase(locale).trim();

	public useLowerCase = (text: string, locale: Locale = "en"): string =>
		text.toLocaleLowerCase(locale).trim();

	public useCapitalize = (text: string, locale: Locale = "en"): string => {
		const trimmed = text.trim();
		if (!trimmed) return "";
		return trimmed.charAt(0).toLocaleUpperCase(locale) + trimmed.slice(1);
	};

	public useFormatCurrency = (options: CurrencyFormatOptions): string => {
		const { amount, currency = "USD", taxes = 0, locale = "en" } = options;
		// `taxes` may be a percentage (21) or a decimal fraction (0.21).
		const taxRate = taxes > 1 ? taxes / 100 : taxes;
		const total = amount * (1 + taxRate);

		return new Intl.NumberFormat(locale, { style: "currency", currency }).format(total);
	};

	public useJsonStringify = (data: unknown): string => JSON.stringify(data, null, 3);

	public useJsonParse = <T = unknown>(json: string): T => JSON.parse(json) as T;
}

/**
 * Unit converter facade (Facade + Adapter + Singleton) built on FormatterService.
 */
export class ConverterService implements IConverterService {
	private static instance: ConverterService;
	private readonly formatter: FormatterService;

	private constructor() {
		this.formatter = FormatterService.getInstance();
	}

	public static getInstance(): ConverterService {
		if (!ConverterService.instance) {
			ConverterService.instance = new ConverterService();
		}
		return ConverterService.instance;
	}

	public useToCelsius = (fahrenheit: number, locale: Locale = "en", digits = 2): string =>
		this.formatter.useFormatNumber((fahrenheit - 32) / 1.8, locale, digits);

	public useToFahrenheit = (celsius: number, locale: Locale = "en", digits = 2): string =>
		this.formatter.useFormatNumber(celsius * 1.8 + 32, locale, digits);

	public useToKilometers = (miles: number, locale: Locale = "en", digits = 2): string =>
		this.formatter.useFormatNumber(miles / 0.62137, locale, digits);

	public useToMiles = (km: number, locale: Locale = "en", digits = 2): string =>
		this.formatter.useFormatNumber(km / 1.60934, locale, digits);

	public useToInches = (cm: number, locale: Locale = "en", digits = 2): string =>
		this.formatter.useFormatNumber(cm / 2.54, locale, digits);

	public useToCm = (inches: number, locale: Locale = "en", digits = 2): string =>
		this.formatter.useFormatNumber(inches * 2.54, locale, digits);

	public useToKilos = (pounds: number, locale: Locale = "en", digits = 2): string =>
		this.formatter.useFormatNumber(pounds * 0.453592, locale, digits);

	public useToPounds = (kilos: number, locale: Locale = "en", digits = 2): string =>
		this.formatter.useFormatNumber(kilos / 0.453592, locale, digits);
}

// Singleton instances and destructured exports.
export const {
	useToCelsius,
	useToFahrenheit,
	useToKilometers,
	useToMiles,
	useToInches,
	useToCm,
	useToKilos,
	useToPounds,
}: ConverterService = ConverterService.getInstance();

export const {
	useFormatCurrency,
	useFormatNumber,
	useJsonStringify,
	useJsonParse,
	useUpperCase,
	useLowerCase,
	useCapitalize,
}: FormatterService = FormatterService.getInstance();


export
