import cors from "cors";
import express, { type Application, type NextFunction, type Request, type Response } from "express";

import { useLogger } from "../../core/services/logger.service.js";
import router from "./router.js";

/** Module-level state for the Express server. */
let app: Application | null = null;
let started = false;

/**
 * Set up CORS, JSON body parser and URL-encoded middleware.
 *
 * @param expressApp - Express application instance
 *
 * @example
 * ```ts
 * const expressApp = express();
 * useExpressSetupMiddlewares(expressApp);
 * ```
 */
function useExpressSetupMiddlewares(expressApp: Application): void {
	const origins = (process.env.CORS_ORIGINS?.split(",") ?? ["http://localhost:3000"])
		.map((origin) => origin.trim())
		.filter(Boolean);

	expressApp.use(
		cors({
			origin: origins,
			methods: ["GET", "POST", "PUT", "DELETE"],
		}),
	);
	expressApp.disable("x-powered-by");
	expressApp.use(express.json({ limit: "100kb" }));
	expressApp.use(express.urlencoded({ extended: true, limit: "100kb" }));
}

/**
 * Set up health check and application routes.
 *
 * @param expressApp - Express application instance
 *
 * @example
 * ```ts
 * useExpressSetupRoutes(expressApp);
 * // GET /health returns { status: "ok", timestamp: "..." }
 * ```
 */
function useExpressSetupRoutes(expressApp: Application): void {
	expressApp.get("/health", (_request: Request, response: Response) => {
		return response.json({
			status: "ok",
			timestamp: new Date().toISOString(),
		});
	});

	expressApp.use("/", router);
}

/**
 * Set up global error handling and 404 fallback.
 *
 * @param expressApp - Express application instance
 *
 * @example
 * ```ts
 * useExpressSetupErrorHandling(expressApp);
 * // Unhandled errors return 500, unknown routes return 404
 * ```
 */
function useExpressSetupErrorHandling(expressApp: Application): void {
	expressApp.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
		console.error("Unhandled error:", err);
		res.status(500).json({ error: "Internal Server Error" });
	});

	expressApp.use((_req: Request, res: Response) => {
		res.status(404).json({ error: "Not Found" });
	});
}

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
export const useExpressCreate = (): Application => {
	if (app) return app;

	app = express();
	useExpressSetupMiddlewares(app);
	useExpressSetupRoutes(app);
	useExpressSetupErrorHandling(app);

	return app;
};

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
export const useExpressStart = (port = 3000, host = "localhost"): void => {
	if (started) return;
	started = true;

	const expressApp = useExpressCreate();

	expressApp.listen(port, host, () => {
		useLogger("info", `Server running on http://${host}:${port}`);
	});
};

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
export const useExpressGetApp = (): Application => useExpressCreate();
