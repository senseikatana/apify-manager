import type { LogLevel, LogStrategy } from "../../types/index.js";
/**
 * Concrete strategy: native console output.
 * Advanced: pass an instance to {@link useSetStrategy} to redirect logs.
 */
export declare class ConsoleStrategy implements LogStrategy {
    useOutput(level: LogLevel, message: string, data?: unknown): void;
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
export declare class LoggerService {
    private static instance;
    private strategy;
    private constructor();
    static getInstance(): LoggerService;
    useSetStrategy: (strategy: LogStrategy) => void;
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
    useLogger: {
        (messageOrData: unknown, level?: LogLevel): void;
        (message: string, data: unknown, level?: LogLevel): void;
    };
    useLoggerClear: () => void;
    useLoggerTable: (data: unknown) => void;
}
/**
 * Destructured exports — what you import from `katanakit-js` / CDN:
 *
 * ```ts
 * import { useLogger, useLoggerClear, useLoggerTable } from "katanakit-js";
 * ```
 */
export declare const useLogger: {
    (messageOrData: unknown, level?: LogLevel): void;
    (message: string, data: unknown, level?: LogLevel): void;
}, useLoggerClear: () => void, useLoggerTable: (data: unknown) => void, useSetStrategy: (strategy: LogStrategy) => void;
//# sourceMappingURL=logger.service.d.ts.map