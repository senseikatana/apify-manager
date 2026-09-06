import { describe, expect, it } from "vitest";

import { LoggerService, type LogStrategy } from "@/core/services/logger.service";

describe("LoggerService", () => {
	it("delegates to the configured strategy", () => {
		const calls: Array<{ level: string; message: string }> = [];
		const strategy: LogStrategy = {
			useOutput: (level, message) => calls.push({ level, message }),
		};

		const logger = LoggerService.getInstance();
		logger.useSetStrategy(strategy);
		logger.useLog("info", "hello", { id: 1 });

		expect(calls).toEqual([{ level: "info", message: "hello" }]);
	});

	it("defaults to the info level when only a message is provided", () => {
		const calls: Array<{ level: string; message: string }> = [];
		const strategy: LogStrategy = {
			useOutput: (level, message) => calls.push({ level, message }),
		};

		const logger = LoggerService.getInstance();
		logger.useSetStrategy(strategy);
		logger.useLog("plain message");

		expect(calls).toEqual([{ level: "info", message: "plain message" }]);
	});

	it("treats a lone level token as an info message", () => {
		const calls: Array<{ level: string; message: string }> = [];
		const strategy: LogStrategy = {
			useOutput: (level, message) => calls.push({ level, message }),
		};

		const logger = LoggerService.getInstance();
		logger.useSetStrategy(strategy);
		logger.useLog("error");

		expect(calls).toEqual([{ level: "info", message: "error" }]);
	});
});
