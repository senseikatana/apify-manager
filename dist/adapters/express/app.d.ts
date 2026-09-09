import type { Application } from "express";
import { useExpressGetApp, useExpressStart } from "./server.js";
/**
 * Re-exported Express application instance.
 *
 * @example
 * ```ts
 * import { app } from "katanakit-js/adapters/express";
 * app.get("/custom", (req, res) => res.json({ ok: true }));
 * ```
 */
export declare const app: Application;
/**
 * Get the Express application instance.
 *
 * @example
 * ```ts
 * import { useGetApp } from "katanakit-js/adapters/express";
 * const expressApp = useGetApp();
 * ```
 */
export declare const useGetApp: typeof useExpressGetApp;
/**
 * Start the Express HTTP server.
 *
 * @example
 * ```ts
 * import { useStart } from "katanakit-js/adapters/express";
 * useStart(3000, "localhost");
 * ```
 */
export declare const useStart: typeof useExpressStart;
//# sourceMappingURL=app.d.ts.map