import { socket } from "./socket.manager";
import type { SocketResponse } from "@/types/socket.type";

export const socketListener = <T>(
	event: string,
	callback: (data: SocketResponse<T>) => void
): void => {
	if (!socket) {
		console.error("Socket is not initialized");
		return;
	}

	socket.on(event, (data: SocketResponse<T>) => {
		callback(data);
	});
};
