import { type Application } from "express";
/**
 * Create and configure the Express application.
 *
 * @returns Configured Express Application instance
 *
 * @example
 * ```ts
 * const expressApp = useExpressCreate();
 * // App is ready with middleware, routes and error handling
 * ```
 */
export declare const useExpressCreate: () => Application;
/**
 * Start the Express HTTP server. Idempotent — subsequent calls are no-ops.
 *
 * @param port - Port to listen on (default: 3000)
 * @param host - Host to bind to (default: "localhost")
 *
 * @example
 * ```ts
 * useExpressStart(3000, "localhost");
 * // Server running on http://localhost:3000
 * ```
 */
export declare const useExpressStart: (port?: number, host?: string) => void;
/**
 * Get the Express application instance. Creates it if it doesn't exist.
 *
 * @returns Express Application instance
 *
 * @example
 * ```ts
 * const expressApp = useExpressGetApp();
 * expressApp.get("/custom", (req, res) => res.json({ ok: true }));
 * ```
 */
export declare const useExpressGetApp: () => Application;
//# sourceMappingURL=server.d.ts.map