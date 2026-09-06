/**
 * Concrete strategy: native console output.
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
 * Singleton context: holds the active strategy and keeps `this` bound through
 * arrow-function methods so destructured exports remain safe.
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
     * Overloads allow:
     * - message only: `useLog("message")`
     * - message + data: `useLog("message", { id: 1 })`
     * - level + message + data: `useLog("error", "something failed", { code: 500 })`
     */
    useLog = (param1, param2, param3) => {
        const levels = ["log", "info", "warn", "error", "debug"];
        // Lone level token without a message — treat as a plain info message.
        if (levels.includes(param1) && param2 === undefined) {
            this.strategy.useOutput("info", param1);
            return;
        }
        if (levels.includes(param1)) {
            const level = param1;
            const message = typeof param2 === "string" ? param2 : String(param2 ?? "");
            this.strategy.useOutput(level, message, param3);
            return;
        }
        this.strategy.useOutput("info", param1, param2);
    };
    useError = (message, data) => {
        this.strategy.useOutput("error", message, data);
    };
    useClear = () => {
        console.clear();
    };
    useTable = (data) => {
        console.table(data);
    };
}
// Singleton instance and destructured exports.
export const { useClear, useLog, useError, useTable, useSetStrategy } = LoggerService.getInstance();
//# sourceMappingURL=logger.service.js.map