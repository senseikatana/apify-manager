import type { LogLevel, LogStrategy } from "../../types/index.js";

const LOG_LEVELS: readonly LogLevel[] = ["log", "info", "warn", "error", "debug"];

const isLogLevel = (value: unknown): value is LogLevel =>
	typeof value === "string" && LOG_LEVELS.includes(value as LogLevel);

/**
 * Concrete strategy: native console output.
 * Advanced: pass an instance to {@link useSetStrategy} to redirect logs.
 */
export class ConsoleStrategy implements LogStrategy {
	useOutput(level: LogLevel, message: string, data?: unknown): void {
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
	private static instance: LoggerService;
	private strategy: LogStrategy;

	private constructor() {
		this.strategy = new ConsoleStrategy();
	}

	public static getInstance(): LoggerService {
		if (!LoggerService.instance) {
			LoggerService.instance = new LoggerService();
		}
		return LoggerService.instance;
	}

	public useSetStrategy = (strategy: LogStrategy): void => {
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
	public useLogger: {
		(messageOrData: unknown, level?: LogLevel): void;
		(message: string, data: unknown, level?: LogLevel): void;
	} = (messageOrData: unknown, dataOrLevel?: unknown, level?: LogLevel): void => {
		if (dataOrLevel === undefined) {
			if (typeof messageOrData === "string") {
				this.strategy.useOutput("info", messageOrData);
			} else {
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
		} else {
			this.strategy.useOutput(dataOrLevel, "", messageOrData);
		}
	};

	public useLoggerClear = (): void => {
		console.clear();
	};

	public useLoggerTable = (data: unknown): void => {
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
export const { useLogger, useLoggerClear, useLoggerTable, useSetStrategy }: LoggerService =
	LoggerService.getInstance();
