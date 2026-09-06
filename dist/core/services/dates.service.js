import { Temporal } from "@js-temporal/polyfill";
import { useLog } from "./logger.service.js";
/**
 * Facade + Adapter + Singleton over the Temporal polyfill.
 *
 * Most methods are pure transforms of their date inputs. Exceptions:
 * {@link DatesService.useNow} / {@link DatesService.useNowDateTime} / default
 * args on month helpers read the system clock (impure).
 */
export class DatesService {
    static instance;
    constructor() { }
    static getInstance() {
        if (!DatesService.instance) {
            DatesService.instance = new DatesService();
        }
        return DatesService.instance;
    }
    // Private helper that adapts flexible inputs into a PlainDate.
    TO_PLAIN_DATE = (date) => typeof date === "string" ? Temporal.PlainDate.from(date) : date;
    useDiff = (start, end) => {
        const startDate = this.TO_PLAIN_DATE(start);
        const endDate = this.TO_PLAIN_DATE(end);
        const duration = startDate.until(endDate, { largestUnit: "year" });
        return `${duration.years} years, ${duration.months} months and ${duration.days} days`;
    };
    useFormat = (dateInput, locale = "en", options = {}) => {
        let date;
        try {
            if (typeof dateInput === "number") {
                date = Temporal.Instant.fromEpochMilliseconds(dateInput).toZonedDateTimeISO(Temporal.Now.timeZoneId());
            }
            else if (typeof dateInput === "string") {
                try {
                    date = Temporal.PlainDate.from(dateInput);
                }
                catch {
                    date = Temporal.PlainDateTime.from(dateInput);
                }
            }
            else if (dateInput instanceof Date) {
                date = Temporal.Instant.fromEpochMilliseconds(dateInput.getTime()).toZonedDateTimeISO(Temporal.Now.timeZoneId());
            }
            else if (dateInput instanceof Temporal.Instant) {
                date = dateInput.toZonedDateTimeISO(Temporal.Now.timeZoneId());
            }
            else {
                date = dateInput;
            }
            return date.toLocaleString(locale, options);
        }
        catch (error) {
            console.error("Invalid date input:", error);
            throw new Error(`Invalid date input: ${dateInput}`);
        }
    };
    useNow = () => Temporal.Now.plainDateISO().toString();
    useNowDateTime = () => Temporal.Now.plainDateTimeISO().toString();
    useAddDays = (date, days) => this.TO_PLAIN_DATE(date).add({ days }).toString();
    useSubtractDays = (date, days) => this.TO_PLAIN_DATE(date).subtract({ days }).toString();
    useIsEqual = (date1, date2) => Temporal.PlainDate.compare(this.TO_PLAIN_DATE(date1), this.TO_PLAIN_DATE(date2)) === 0;
    useIsBefore = (date1, date2) => Temporal.PlainDate.compare(this.TO_PLAIN_DATE(date1), this.TO_PLAIN_DATE(date2)) < 0;
    useIsAfter = (date1, date2) => Temporal.PlainDate.compare(this.TO_PLAIN_DATE(date1), this.TO_PLAIN_DATE(date2)) > 0;
    useFirstDayOfMonth = (date = Temporal.Now.plainDateISO()) => this.TO_PLAIN_DATE(date).with({ day: 1 }).toString();
    useLastDayOfMonth = (date = Temporal.Now.plainDateISO()) => this.TO_PLAIN_DATE(date).add({ months: 1 }).with({ day: 1 }).subtract({ days: 1 }).toString();
}
// Singleton instance and destructured exports.
export const { useDiff, useFormat, useNow, useNowDateTime, useAddDays, useSubtractDays, useIsEqual, useIsBefore, useIsAfter, useFirstDayOfMonth, useLastDayOfMonth, } = DatesService.getInstance();
useLog("log", useNowDateTime());
//# sourceMappingURL=dates.service.js.map