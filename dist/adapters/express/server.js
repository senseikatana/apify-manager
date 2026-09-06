import cors from "cors";
import express from "express";
import { useLog } from "../../core/services/logger.service.js";
import router from "./router.js";
export default class ServerExpress {
    static instance;
    app;
    port;
    host;
    started = false;
    constructor(port = 3000, host = "localhost") {
        this.app = express();
        this.port = port;
        this.host = host;
    }
    static getInstance() {
        if (!ServerExpress.instance) {
            ServerExpress.instance = new ServerExpress();
        }
        return ServerExpress.instance;
    }
    /**
     * Boots middleware, routes and the HTTP listener once.
     * Subsequent calls are no-ops (idempotent).
     */
    useStart = () => {
        if (this.started)
            return;
        this.started = true;
        this.setupMiddlewares();
        this.setupRoutes();
        this.setupErrorHandling();
        this.app.listen(this.port, this.host, () => {
            useLog(`Server running on http://${this.host}:${this.port}`);
        });
    };
    useGetApp = () => this.app;
    setupMiddlewares() {
        const origins = (process.env.CORS_ORIGINS?.split(",") ?? ["http://localhost:3000"])
            .map((origin) => origin.trim())
            .filter(Boolean);
        this.app.use(cors({
            origin: origins,
            methods: ["GET", "POST", "PUT", "DELETE"],
        }));
        this.app.disable("x-powered-by");
        this.app.use(express.json({ limit: "100kb" }));
        this.app.use(express.urlencoded({ extended: true, limit: "100kb" }));
    }
    setupRoutes() {
        this.app.get("/health", (_request, response) => {
            return response.json({
                status: "ok",
                timestamp: new Date().toISOString(),
            });
        });
        this.app.use("/", router);
    }
    setupErrorHandling() {
        this.app.use((err, _req, res, _next) => {
            console.error("Unhandled error:", err);
            res.status(500).json({ error: "Internal Server Error" });
        });
        this.app.use((_req, res) => {
            res.status(404).json({ error: "Not Found" });
        });
    }
}
//# sourceMappingURL=server.js.map