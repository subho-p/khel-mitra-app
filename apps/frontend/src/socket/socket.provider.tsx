import React, { useEffect } from "react";
import { SocketContext } from "./socket.context";
import { SocketManager } from "./socket.manager";
import { useAuth } from "@/contexts/auth.context";

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
	const { isAuthenticated } = useAuth();

	useEffect(() => {
		if (isAuthenticated) {
			SocketManager.getInstance().connect();
		} else {
			SocketManager.getInstance().disconnect();
		}
	}, [isAuthenticated]);

	return (
		<SocketContext.Provider
			value={{
				socket: SocketManager.getInstance().socket,
				connect: SocketManager.getInstance().connect,
				disconnect: SocketManager.getInstance().disconnect,
				isConnected: SocketManager.getInstance().socket?.connected || false,
			}}
		>
			{children}
		</SocketContext.Provider>
	);
};
