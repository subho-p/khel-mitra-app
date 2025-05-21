import React from "react";
import type { Socket } from "socket.io-client";

interface SocketState {
	socket: Socket | null;
	isConnected: boolean;
	connect: () => void;
	disconnect: () => void;
}

export const SocketContext = React.createContext<SocketState | undefined>(undefined);

export const useSocket = () => {
	const context = React.useContext(SocketContext);
	if (context === undefined) {
		throw new Error("useSocket must be used within a SocketProvider.");
	}
	return context;
};
