import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRoutes } from "./routes/auth.routes.js";
import { logger } from "@khel-mitra/shared/utils/logger";

const app = express();

// Middlewares
app.use(cors());
app.use(cookieParser());

app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: true, limit: "32kb" }));
app.use(express.static("public"));

// ROUTES
app.use("/health", (req, res) => {
	res.status(200).json({ message: "hey boy, I am healthy and tasty" });
});

app.use("/api/auth", authRoutes);

// ERROR HANDLERS
app.use((req, res, next) => {
	res.status(404).json({ message: `${req.method} ${req.url} is not found` });
	next();
});
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
	const reqMethod = req.method;
	const reqUrl = req.url.replace("/api", "");
	logger.error(err, [reqMethod, reqUrl], "error");
	res.status(500).json({ message: err?.message || "something went wrong" });
});

export default app;
