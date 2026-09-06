import { Temporal } from "@js-temporal/polyfill";
import type { DatesServiceTypes, Locale, TemporalInput } from "../../types/index.js";
/**
 * Facade + Adapter + Singleton over the Temporal polyfill.
 *
 * Most methods are pure transforms of their date inputs. Exceptions:
 * {@link DatesService.useNow} / {@link DatesService.useNowDateTime} / default
 * args on month helpers read the system clock (impure).
 */
export declare class DatesService implements DatesServiceTypes {
    private static instance;
    private constructor();
    static getInstance(): DatesService;
    private TO_PLAIN_DATE;
    useDiff: (start: string | Temporal.PlainDate, end: string | Temporal.PlainDate) => string;
    useFormat: (dateInput: TemporalInput, locale?: Locale, options?: Intl.DateTimeFormatOptions) => string;
    useNow: () => string;
    useNowDateTime: () => string;
    useAddDays: (date: string | Temporal.PlainDate, days: number) => string;
    useSubtractDays: (date: string | Temporal.PlainDate, days: number) => string;
    useIsEqual: (date1: string | Temporal.PlainDate, date2: string | Temporal.PlainDate) => boolean;
    useIsBefore: (date1: string | Temporal.PlainDate, date2: string | Temporal.PlainDate) => boolean;
    useIsAfter: (date1: string | Temporal.PlainDate, date2: string | Temporal.PlainDate) => boolean;
    useFirstDayOfMonth: (date?: string | Temporal.PlainDate) => string;
    useLastDayOfMonth: (date?: string | Temporal.PlainDate) => string;
}
export declare const useDiff: (start: string | Temporal.PlainDate, end: string | Temporal.PlainDate) => string, useFormat: (dateInput: TemporalInput, locale?: Locale, options?: Intl.DateTimeFormatOptions) => string, useNow: () => string, useNowDateTime: () => string, useAddDays: (date: string | Temporal.PlainDate, days: number) => string, useSubtractDays: (date: string | Temporal.PlainDate, days: number) => string, useIsEqual: (date1: string | Temporal.PlainDate, date2: string | Temporal.PlainDate) => boolean, useIsBefore: (date1: string | Temporal.PlainDate, date2: string | Temporal.PlainDate) => boolean, useIsAfter: (date1: string | Temporal.PlainDate, date2: string | Temporal.PlainDate) => boolean, useFirstDayOfMonth: (date?: string | Temporal.PlainDate) => string, useLastDayOfMonth: (date?: string | Temporal.PlainDate) => string;
//# sourceMappingURL=dates.service.d.ts.map