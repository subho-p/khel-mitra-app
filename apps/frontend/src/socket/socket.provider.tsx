import React, { useEffect } from "react";
import { SocketContext } from "./socket.context";
import { SocketManager } from "./socket.manager";
import { useAuth } from "@/contexts/auth.context";

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
	const { status } = useAuth();

	useEffect(() => {
		if (status === "authenticated") {
			SocketManager.getInstance().connect();
		}

		if (status === "unauthenticated") {
			SocketManager.getInstance().disconnect();
		}
	}, [status]);

	useEffect(() => {
		return () => {
			SocketManager.getInstance().disconnect();
		};
	}, []);

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
