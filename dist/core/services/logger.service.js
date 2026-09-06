const LOG_LEVELS = ["log", "info", "warn", "error", "debug"];
const isLogLevel = (value) => typeof value === "string" && LOG_LEVELS.includes(value);
/**
 * Concrete strategy: native console output.
 * Advanced: pass an instance to {@link useSetStrategy} to redirect logs.
 */
export class ConsoleStrategy {
    useOutput(level, message, data) {
        if (data !== undefined) {
            console[level](`[${level.toUpperCase()}] ${message}`, data);
            return;
        }
        console[level](`[${level.toUpperCase()}] ${message}`);
    }
}
/**
 * Logger facade (Singleton + Strategy).
 *
 * Public surface for consumers:
 * - {@link useLogger} — all levels (`info` default; level always last)
 * - {@link useLoggerClear} — `console.clear`
 * - {@link useLoggerTable} — `console.table`
 * - {@link useSetStrategy} — swap output (tests / telemetry)
 */
export class LoggerService {
    static instance;
    strategy;
    constructor() {
        this.strategy = new ConsoleStrategy();
    }
    static getInstance() {
        if (!LoggerService.instance) {
            LoggerService.instance = new LoggerService();
        }
        return LoggerService.instance;
    }
    useSetStrategy = (strategy) => {
        this.strategy = strategy;
    };
    /**
     * Logs a message and/or data. Level is always the **last** argument.
     *
     * @example
     * ```ts
     * import { useLogger } from "katanakit-js";
     *
     * useLogger("Application started");
     * useLogger("Cache miss", "warn");
     * useLogger("Database timeout", { query: "SELECT 1" }, "error");
     * useLogger({ id: 1 }, "debug");
     * ```
     */
    useLogger = (messageOrData, dataOrLevel, level) => {
        if (dataOrLevel === undefined) {
            if (typeof messageOrData === "string") {
                this.strategy.useOutput("info", messageOrData);
            }
            else {
                this.strategy.useOutput("info", "", messageOrData);
            }
            return;
        }
        if (level !== undefined || !isLogLevel(dataOrLevel)) {
            const message = typeof messageOrData === "string" ? messageOrData : String(messageOrData);
            this.strategy.useOutput(level ?? "info", message, dataOrLevel);
            return;
        }
        if (typeof messageOrData === "string") {
            this.strategy.useOutput(dataOrLevel, messageOrData);
        }
        else {
            this.strategy.useOutput(dataOrLevel, "", messageOrData);
        }
    };
    useLoggerClear = () => {
        console.clear();
    };
    useLoggerTable = (data) => {
        console.table(data);
    };
}
/**
 * Destructured exports — what you import from `katanakit-js` / CDN:
 *
 * ```ts
 * import { useLogger, useLoggerClear, useLoggerTable } from "katanakit-js";
 * ```
 */
export const { useLogger, useLoggerClear, useLoggerTable, useSetStrategy } = LoggerService.getInstance();
//# sourceMappingURL=logger.service.js.map