import cors from "cors";
import express, { type Application, type NextFunction, type Request, type Response } from "express";

import { useLogger } from "../../core/services/logger.service.js";
import router from "./router.js";

export default class ServerExpress {
	private static instance: ServerExpress;
	private readonly app: Application;
	private readonly port: number;
	private readonly host: string;
	private started = false;

	private constructor(port = 3000, host = "localhost") {
		this.app = express();
		this.port = port;
		this.host = host;
	}

	static getInstance(): ServerExpress {
		if (!ServerExpress.instance) {
			ServerExpress.instance = new ServerExpress();
		}
		return ServerExpress.instance;
	}

	/**
	 * Boots middleware, routes and the HTTP listener once.
	 * Subsequent calls are no-ops (idempotent).
	 */
	useStart = (): void => {
		if (this.started) return;
		this.started = true;

		this.setupMiddlewares();
		this.setupRoutes();
		this.setupErrorHandling();

		this.app.listen(this.port, this.host, () => {
			useLogger(`Server running on http://${this.host}:${this.port}`);
		});
	};

	useGetApp = (): Application => this.app;

	private setupMiddlewares(): void {
		const origins = (process.env.CORS_ORIGINS?.split(",") ?? ["http://localhost:3000"])
			.map((origin) => origin.trim())
			.filter(Boolean);

		this.app.use(
			cors({
				origin: origins,
				methods: ["GET", "POST", "PUT", "DELETE"],
			}),
		);
		this.app.disable("x-powered-by");
		this.app.use(express.json({ limit: "100kb" }));
		this.app.use(express.urlencoded({ extended: true, limit: "100kb" }));
	}

	private setupRoutes(): void {
		this.app.get("/health", (_request: Request, response: Response) => {
			return response.json({
				status: "ok",
				timestamp: new Date().toISOString(),
			});
		});

		this.app.use("/", router);
	}

	private setupErrorHandling(): void {
		this.app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
			console.error("Unhandled error:", err);
			res.status(500).json({ error: "Internal Server Error" });
		});

		this.app.use((_req: Request, res: Response) => {
			res.status(404).json({ error: "Not Found" });
		});
	}
}
