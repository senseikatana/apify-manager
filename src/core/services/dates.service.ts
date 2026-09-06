import { Temporal } from "@js-temporal/polyfill";

import type { DatesServiceTypes, Locale, TemporalInput } from "../../types/index.js";

/**
 * Facade + Adapter + Singleton over the Temporal polyfill.
 *
 * Most methods are pure transforms of their date inputs. Exceptions:
 * {@link DatesService.useNow} / {@link DatesService.useNowDateTime} / default
 * args on month helpers read the system clock (impure).
 */
export class DatesService implements DatesServiceTypes {
	private static instance: DatesService;

	private constructor() {}

	public static getInstance(): DatesService {
		if (!DatesService.instance) {
			DatesService.instance = new DatesService();
		}
		return DatesService.instance;
	}

	// Private helper that adapts flexible inputs into a PlainDate.
	private TO_PLAIN_DATE = (date: string | Temporal.PlainDate): Temporal.PlainDate =>
		typeof date === "string" ? Temporal.PlainDate.from(date) : date;

	public useDiff = (
		start: string | Temporal.PlainDate,
		end: string | Temporal.PlainDate,
	): string => {
		const startDate = this.TO_PLAIN_DATE(start);
		const endDate = this.TO_PLAIN_DATE(end);
		const duration = startDate.until(endDate, { largestUnit: "year" });

		return `${duration.years} years, ${duration.months} months and ${duration.days} days`;
	};

	public useFormat = (
		dateInput: TemporalInput,
		locale: Locale = "en",
		options: Intl.DateTimeFormatOptions = {},
	): string => {
		let date: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime;

		try {
			if (typeof dateInput === "number") {
				date = Temporal.Instant.fromEpochMilliseconds(dateInput).toZonedDateTimeISO(
					Temporal.Now.timeZoneId(),
				);
			} else if (typeof dateInput === "string") {
				try {
					date = Temporal.PlainDate.from(dateInput);
				} catch {
					date = Temporal.PlainDateTime.from(dateInput);
				}
			} else if (dateInput instanceof Date) {
				date = Temporal.Instant.fromEpochMilliseconds(dateInput.getTime()).toZonedDateTimeISO(
					Temporal.Now.timeZoneId(),
				);
			} else if (dateInput instanceof Temporal.Instant) {
				date = dateInput.toZonedDateTimeISO(Temporal.Now.timeZoneId());
			} else {
				date = dateInput;
			}

			return date.toLocaleString(locale, options);
		} catch (error) {
			console.error("Invalid date input:", error);
			throw new Error(`Invalid date input: ${dateInput}`);
		}
	};

	public useNow = (): string => Temporal.Now.plainDateISO().toString();

	public useNowDateTime = (): string => Temporal.Now.plainDateTimeISO().toString();

	public useAddDays = (date: string | Temporal.PlainDate, days: number): string =>
		this.TO_PLAIN_DATE(date).add({ days }).toString();

	public useSubtractDays = (date: string | Temporal.PlainDate, days: number): string =>
		this.TO_PLAIN_DATE(date).subtract({ days }).toString();

	public useIsEqual = (
		date1: string | Temporal.PlainDate,
		date2: string | Temporal.PlainDate,
	): boolean =>
		Temporal.PlainDate.compare(this.TO_PLAIN_DATE(date1), this.TO_PLAIN_DATE(date2)) === 0;

	public useIsBefore = (
		date1: string | Temporal.PlainDate,
		date2: string | Temporal.PlainDate,
	): boolean => Temporal.PlainDate.compare(this.TO_PLAIN_DATE(date1), this.TO_PLAIN_DATE(date2)) < 0;

	public useIsAfter = (
		date1: string | Temporal.PlainDate,
		date2: string | Temporal.PlainDate,
	): boolean => Temporal.PlainDate.compare(this.TO_PLAIN_DATE(date1), this.TO_PLAIN_DATE(date2)) > 0;

	public useFirstDayOfMonth = (
		date: string | Temporal.PlainDate = Temporal.Now.plainDateISO(),
	): string => this.TO_PLAIN_DATE(date).with({ day: 1 }).toString();

	public useLastDayOfMonth = (
		date: string | Temporal.PlainDate = Temporal.Now.plainDateISO(),
	): string =>
		this.TO_PLAIN_DATE(date).add({ months: 1 }).with({ day: 1 }).subtract({ days: 1 }).toString();
}

// Singleton instance and destructured exports.
export const {
	useDiff,
	useFormat,
	useNow,
	useNowDateTime,
	useAddDays,
	useSubtractDays,
	useIsEqual,
	useIsBefore,
	useIsAfter,
	useFirstDayOfMonth,
	useLastDayOfMonth,
}: DatesService = DatesService.getInstance();

