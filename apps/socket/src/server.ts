import http from "http";
import { Server } from "socket.io";
import express from "express";
import SocketService from "./services/socket.services.js";
import EnvConfig from "./config/env.config.js";
import cors from "cors";

const corsOptions: cors.CorsOptions = {
	origin: EnvConfig.get("CORS_ORIGIN"),
	credentials: true,
};

export function createServer() {
	const app = express();
	app.use(express.json());
	const server = http.createServer(app);
	const io = new Server(server, {
		cors: {
			...corsOptions,
			methods: ["GET", "POST"],
		},
	});

	new SocketService(io);

	// server health check
	app.use(cors({ ...corsOptions }));
	app.get("/health", (_, res) => {
		res.status(200).json({ message: "Server is healthy" });
	});

	return server;
}
