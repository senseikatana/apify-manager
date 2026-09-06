import { type Application } from "express";
export default class ServerExpress {
    private static instance;
    private readonly app;
    private readonly port;
    private readonly host;
    private started;
    private constructor();
    static getInstance(): ServerExpress;
    /**
     * Boots middleware, routes and the HTTP listener once.
     * Subsequent calls are no-ops (idempotent).
     */
    useStart: () => void;
    useGetApp: () => Application;
    private setupMiddlewares;
    private setupRoutes;
    private setupErrorHandling;
}
//# sourceMappingURL=server.d.ts.map