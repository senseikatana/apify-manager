const LOG_LEVELS = ["log", "info", "warn", "error", "debug"];
const isLogLevel = (value) => typeof value === "string" && LOG_LEVELS.includes(value);
/**
 * Concrete strategy: native console output.
 * Pass an instance to {@link useSetStrategy} to redirect logs.
 *
 * @example
 * ```ts
 * import { ConsoleStrategy, useSetStrategy } from "katanakit-js";
 *
 * useSetStrategy(ConsoleStrategy);
 * ```
 */
export const ConsoleStrategy = {
    /**
     * Outputs a log message to the native console.
     *
     * @param level - The log level (`log`, `info`, `warn`, `error`, `debug`).
     * @param message - The message string.
     * @param data - Optional data to attach to the log.
     */
    useOutput(level, message, data) {
        if (data !== undefined) {
            console[level](`[${level.toUpperCase()}] ${message}`, data);
            return;
        }
        console[level](`[${level.toUpperCase()}] ${message}`);
    },
};
/** Log level priority (lower = more verbose). */
const LEVEL_PRIORITY = {
    debug: 0,
    log: 1,
    info: 1,
    warn: 2,
    error: 3,
};
/** Module-level log level. Defaults to `"info"`. */
let logLevel = "info";
/** Module-level log strategy. Defaults to {@link ConsoleStrategy}. */
let strategy = ConsoleStrategy;
/** Check if a message at the given level should be output. */
function shouldLog(level) {
    return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[logLevel];
}
/**
 * Sets the active log level. Messages below this level are suppressed.
 *
 * @param level - The minimum log level to output.
 *
 * @example
 * ```ts
 * import { useSetLogLevel } from "katanakit-js";
 *
 * useSetLogLevel("warn"); // only warn and error will be output
 * ```
 */
export function useSetLogLevel(level) {
    logLevel = level;
}
/**
 * Swaps the active log strategy (e.g. for tests or telemetry).
 *
 * @param newStrategy - A {@link LogStrategy} implementation.
 *
 * @example
 * ```ts
 * import { useSetStrategy } from "katanakit-js";
 *
 * useSetStrategy({
 *   useOutput(level, message, data) {
 *     // send to external telemetry
 *   },
 * });
 * ```
 */
export function useSetStrategy(newStrategy) {
    strategy = newStrategy;
}
/**
 * Logs a message and/or data. Level is always the **last** argument.
 *
 * @param messageOrData - A string message or arbitrary data.
 * @param dataOrLevel - Data to attach, or the log level.
 * @param level - The log level when data is also provided.
 *
 * @example
 * ```ts
 * import { useLog } from "katanakit-js";
 *
 * useLog("Application started");
 * useLog("Cache miss", "warn");
 * useLog("Database timeout", { query: "SELECT 1" }, "error");
 * useLog({ id: 1 }, "debug");
 * ```
 */
export function useLog(messageOrData, dataOrLevel, level) {
    // If level is explicitly provided, use it
    if (level !== undefined) {
        if (!shouldLog(level))
            return;
        const message = typeof messageOrData === "string" ? messageOrData : String(messageOrData);
        strategy.useOutput(level, message, dataOrLevel);
        return;
    }
    if (dataOrLevel === undefined) {
        if (!shouldLog("info"))
            return;
        if (typeof messageOrData === "string") {
            strategy.useOutput("info", messageOrData);
        }
        else {
            strategy.useOutput("info", "", messageOrData);
        }
        return;
    }
    if (isLogLevel(dataOrLevel)) {
        if (!shouldLog(dataOrLevel))
            return;
        if (typeof messageOrData === "string") {
            strategy.useOutput(dataOrLevel, messageOrData);
        }
        else {
            strategy.useOutput(dataOrLevel, "", messageOrData);
        }
    }
    else {
        if (!shouldLog("info"))
            return;
        const message = typeof messageOrData === "string" ? messageOrData : String(messageOrData);
        strategy.useOutput("info", message, dataOrLevel);
    }
}
/**
 * Log a message with optional data and level.
 *
 * @param level - The log level ("log", "info", "warn", "error", "debug")
 * @param message - The message to log
 * @param data - Optional data to attach
 *
 * @example
 * ```ts
 * import { useLogger } from "katanakit-js";
 *
 * useLogger("info", "Application started");
 * useLogger("error", "Database timeout", { query: "SELECT 1" });
 * ```
 */
export function useLogger(level = "log", message, data) {
    useLog(message, data, level);
}
/**
 * Clears the console.
 *
 * @example
 * ```ts
 * import { useLoggerClear } from "katanakit-js";
 *
 * useLoggerClear();
 * ```
 */
export function useLoggerClear() {
    console.clear();
}
/**
 * Displays tabular data in the console.
 *
 * @param data - The data to display as a table.
 *
 * @example
 * ```ts
 * import { useLoggerTable } from "katanakit-js";
 *
 * useLoggerTable([{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }]);
 * ```
 */
export function useLoggerTable(data) {
    console.table(data);
}
useLoggerTable([
    {
        id: 1,
        name: "Alice",
    },
]);
//# sourceMappingURL=logger.service.js.map