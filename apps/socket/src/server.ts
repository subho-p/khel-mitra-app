import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import express from "express";

dotenv.config();

export function createServer() {
    const app = express();
	const server = http.createServer(app);
	const io = new Server(server, {
		cors: {
			origin: process.env.CORS_ORIGIN,
			credentials: true,
		},
	});

	return server;
}
