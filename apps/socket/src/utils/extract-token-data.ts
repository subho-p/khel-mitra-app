import { Socket } from "socket.io";
import { BaseUser } from "../types";
import jwt from "jsonwebtoken";
import EnvConfig from "config/env.config";


export function extractTokenData(socket: Socket): BaseUser | undefined {
	try {
		const token = extractTokenFromSocket(socket);
		if (!token) return undefined;
		const payload = jwt.verify(token, EnvConfig.get("JWT_SECRET"));
		if (!payload) return undefined;
		return payload as BaseUser;
	} catch {
		return undefined;
	}
}

export function extractTokenFromSocket(socket: Socket): string | undefined {
	// from cookies
	const cookie = socket.handshake.headers.cookie;
	if (cookie) {
		const match = cookie.match(/access_token=([^;]+)/);
		if (match) {
			return match[1];
		}
	}
	// from auth
	const authHeader = socket.handshake.auth?.access_token;
	if (authHeader) {
		return authHeader;
	}
	// from query
	const token = socket.handshake.query?.access_token as string;
	if (token) {
		return token;
	}

	return undefined;
}
