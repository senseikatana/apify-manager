import type { LogLevel, LogStrategy } from "../../types/index.js";

/**
 * Concrete strategy: native console output.
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
 * Singleton context: holds the active strategy and keeps `this` bound through
 * arrow-function methods so destructured exports remain safe.
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
	 * Overloads allow:
	 * - message only: `useLog("message")`
	 * - message + data: `useLog("message", { id: 1 })`
	 * - level + message + data: `useLog("error", "something failed", { code: 500 })`
	 */
	public useLog: {
		(message: string, data?: unknown): void;
		(level: LogLevel, message: string, data?: unknown): void;
	} = (param1: LogLevel | string, param2?: unknown, param3?: unknown): void => {
		const levels: LogLevel[] = ["log", "info", "warn", "error", "debug"];

		// Lone level token without a message — treat as a plain info message.
		if (levels.includes(param1 as LogLevel) && param2 === undefined) {
			this.strategy.useOutput("info", param1);
			return;
		}

		if (levels.includes(param1 as LogLevel)) {
			const level = param1 as LogLevel;
			const message = typeof param2 === "string" ? param2 : String(param2 ?? "");
			this.strategy.useOutput(level, message, param3);
			return;
		}

		this.strategy.useOutput("info", param1, param2);
	};

	public useError = (message: string, data?: unknown): void => {
		this.strategy.useOutput("error", message, data);
	};

	public useClear = (): void => {
		console.clear();
	};

	public useTable = (data: unknown): void => {
		console.table(data);
	};
}

// Singleton instance and destructured exports.
export const { useClear, useLog, useError, useTable, useSetStrategy }: LoggerService =
	LoggerService.getInstance();
