import type { LogLevel, LogStrategy } from "../../types/index.js";
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
export declare const ConsoleStrategy: LogStrategy;
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
export declare function useSetLogLevel(level: LogLevel): void;
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
export declare function useSetStrategy(newStrategy: LogStrategy): void;
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
export declare function useLog(messageOrData: unknown, dataOrLevel?: unknown, level?: LogLevel): void;
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
export declare function useLogger(level?: LogLevel, message?: unknown, data?: unknown): void;
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
export declare function useLoggerClear(): void;
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
export declare function useLoggerTable(data: unknown): void;
//# sourceMappingURL=logger.service.d.ts.map