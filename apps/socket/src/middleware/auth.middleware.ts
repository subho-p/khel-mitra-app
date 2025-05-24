import { Socket } from "socket.io";
import { UserStore } from "../stores/user.store.js";
import { logger } from "../utils/logger.js";
import { Failure } from "../utils/reponse.js";
import { extractTokenData } from "../utils/extract-token-data.js";

export async function authMiddleware(socket: Socket, next: (err?: any) => void): Promise<void> {
	logger.info(`[AUTH] Socket ${socket.id} authenticating`);
	const user = extractTokenData(socket);
	if (!user) {
		socket.emit("auth:failure", new Failure("Unauthorized"));
		socket.disconnect();
		logger.error(`[AUTH ERROR] user not authenticated`);
		return next(new Failure("Unauthorized"));
	}

	socket.data.user = {
		...user,
		socketId: socket.id,
	};

	logger.info(`[AUTH] Socket ${socket.id} authenticated`);
	UserStore.getInstance().add(socket);

	next();
}
