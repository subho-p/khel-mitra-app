import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import express from "express";
import SocketService from "./services/socket.services";

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

	new SocketService(io);

	return server;
}
