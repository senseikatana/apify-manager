import { Temporal } from "@js-temporal/polyfill";
import type { Locale, TemporalInput } from "../../types/index.js";
/**
 * Returns a human-readable diff between two dates as years, months, and days.
 *
 * @param start - Start date (ISO string or `PlainDate`).
 * @param end - End date (ISO string or `PlainDate`).
 * @returns A formatted string, e.g. `"2 years, 3 months and 15 days"`.
 *
 * @example
 * ```ts
 * useDiff("2020-01-01", "2022-04-16");
 * // "2 years, 3 months and 15 days"
 * ```
 */
export declare function useDiff(start: string | Temporal.PlainDate, end: string | Temporal.PlainDate): string;
/**
 * Formats a date input into a localised string using `Intl.DateTimeFormat`.
 *
 * Accepts epoch milliseconds, ISO strings, native `Date` objects,
 * `Temporal.Instant`, or any `Temporal` date/time type.
 *
 * @param dateInput - The value to format.
 * @param locale - BCP 47 locale tag (defaults to `"en"`).
 * @param options - `Intl.DateTimeFormatOptions` (defaults to `{}`).
 * @returns The formatted date string.
 * @throws {Error} If the input cannot be parsed as a date.
 *
 * @example
 * ```ts
 * useFormat("2024-06-15");                        // "6/15/2024" (en-US)
 * useFormat(Date.now(), "es", { dateStyle: "full" }); // "sábado, 15 de junio de 2024"
 * ```
 */
export declare function useFormat(dateInput: TemporalInput, locale?: Locale, options?: Intl.DateTimeFormatOptions): string;
/**
 * Returns today's date as an ISO date string.
 *
 * @returns The current date in `YYYY-MM-DD` format.
 *
 * @example
 * ```ts
 * useNow(); // "2024-06-15"
 * ```
 */
export declare function useNow(): string;
/**
 * Returns the current date and time as an ISO string (no timezone offset).
 *
 * @returns The current date-time in `YYYY-MM-DDTHH:MM:SS` format.
 *
 * @example
 * ```ts
 * useNowDateTime(); // "2024-06-15T14:30:00"
 * ```
 */
export declare function useNowDateTime(): string;
/**
 * Adds a number of days to a date.
 *
 * @param date - Base date (ISO string or `PlainDate`).
 * @param days - Number of days to add (can be negative).
 * @returns The resulting date as an ISO string.
 *
 * @example
 * ```ts
 * useAddDays("2024-01-01", 10); // "2024-01-11"
 * ```
 */
export declare function useAddDays(date: string | Temporal.PlainDate, days: number): string;
/**
 * Subtracts a number of days from a date.
 *
 * @param date - Base date (ISO string or `PlainDate`).
 * @param days - Number of days to subtract.
 * @returns The resulting date as an ISO string.
 *
 * @example
 * ```ts
 * useSubtractDays("2024-01-11", 10); // "2024-01-01"
 * ```
 */
export declare function useSubtractDays(date: string | Temporal.PlainDate, days: number): string;
/**
 * Checks whether two dates are equal.
 *
 * @param date1 - First date (ISO string or `PlainDate`).
 * @param date2 - Second date (ISO string or `PlainDate`).
 * @returns `true` if the dates represent the same day.
 *
 * @example
 * ```ts
 * useIsEqual("2024-06-15", "2024-06-15"); // true
 * useIsEqual("2024-06-15", "2024-06-16"); // false
 * ```
 */
export declare function useIsEqual(date1: string | Temporal.PlainDate, date2: string | Temporal.PlainDate): boolean;
/**
 * Checks whether `date1` is before `date2`.
 *
 * @param date1 - First date (ISO string or `PlainDate`).
 * @param date2 - Second date (ISO string or `PlainDate`).
 * @returns `true` if `date1` is strictly before `date2`.
 *
 * @example
 * ```ts
 * useIsBefore("2024-01-01", "2024-06-15"); // true
 * useIsBefore("2024-06-15", "2024-06-15"); // false
 * ```
 */
export declare function useIsBefore(date1: string | Temporal.PlainDate, date2: string | Temporal.PlainDate): boolean;
/**
 * Checks whether `date1` is after `date2`.
 *
 * @param date1 - First date (ISO string or `PlainDate`).
 * @param date2 - Second date (ISO string or `PlainDate`).
 * @returns `true` if `date1` is strictly after `date2`.
 *
 * @example
 * ```ts
 * useIsAfter("2024-06-15", "2024-01-01"); // true
 * useIsAfter("2024-06-15", "2024-06-15"); // false
 * ```
 */
export declare function useIsAfter(date1: string | Temporal.PlainDate, date2: string | Temporal.PlainDate): boolean;
/**
 * Returns the first day of the month for a given date.
 *
 * @param date - Base date (defaults to today).
 * @returns The first day of the month as an ISO string.
 *
 * @example
 * ```ts
 * useFirstDayOfMonth("2024-06-15"); // "2024-06-01"
 * ```
 */
export declare function useFirstDayOfMonth(date?: string | Temporal.PlainDate): string;
/**
 * Returns the last day of the month for a given date.
 *
 * @param date - Base date (defaults to today).
 * @returns The last day of the month as an ISO string.
 *
 * @example
 * ```ts
 * useLastDayOfMonth("2024-02-10"); // "2024-02-29" (leap year)
 * useLastDayOfMonth("2024-06-15"); // "2024-06-30"
 * ```
 */
export declare function useLastDayOfMonth(date?: string | Temporal.PlainDate): string;
//# sourceMappingURL=dates.service.d.ts.map