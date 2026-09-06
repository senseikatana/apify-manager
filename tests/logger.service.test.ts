import { describe, expect, it } from "vitest";

import { LoggerService, type LogStrategy, useLogger } from "@/core/services/logger.service";

describe("LoggerService", () => {
	it("logs message with data and level last", () => {
		const calls: Array<{ level: string; message: string; data?: unknown }> = [];
		const strategy: LogStrategy = {
			useOutput: (level, message, data) => calls.push({ level, message, data }),
		};

		const logger = LoggerService.getInstance();
		logger.useSetStrategy(strategy);
		logger.useLogger("hello", { id: 1 }, "info");

		expect(calls).toEqual([{ level: "info", message: "hello", data: { id: 1 } }]);
	});

	it("defaults to the info level when only a message is provided", () => {
		const calls: Array<{ level: string; message: string }> = [];
		const strategy: LogStrategy = {
			useOutput: (level, message) => calls.push({ level, message }),
		};

		const logger = LoggerService.getInstance();
		logger.useSetStrategy(strategy);
		logger.useLogger("plain message");

		expect(calls).toEqual([{ level: "info", message: "plain message" }]);
	});

	it("accepts level as the last argument", () => {
		const calls: Array<{ level: string; message: string }> = [];
		const strategy: LogStrategy = {
			useOutput: (level, message) => calls.push({ level, message }),
		};

		const logger = LoggerService.getInstance();
		logger.useSetStrategy(strategy);
		logger.useLogger("Cache miss", "warn");

		expect(calls).toEqual([{ level: "warn", message: "Cache miss" }]);
	});

	it("treats a lone level token as an info message", () => {
		const calls: Array<{ level: string; message: string }> = [];
		const strategy: LogStrategy = {
			useOutput: (level, message) => calls.push({ level, message }),
		};

		const logger = LoggerService.getInstance();
		logger.useSetStrategy(strategy);
		useLogger("error");

		expect(calls).toEqual([{ level: "info", message: "error" }]);
	});

	it("logs non-string data as the first argument", () => {
		const calls: Array<{ level: string; message: string; data?: unknown }> = [];
		const strategy: LogStrategy = {
			useOutput: (level, message, data) => calls.push({ level, message, data }),
		};

		const logger = LoggerService.getInstance();
		logger.useSetStrategy(strategy);
		logger.useLogger({ id: 42 }, "debug");

		expect(calls).toEqual([{ level: "debug", message: "", data: { id: 42 } }]);
	});
});
