"use client";

import { useSession } from "@/providers/session-provider";
import { socketManager } from "@/socket/socket.manger";
import { useEffect } from "react";

export const AppInit = ({ children }: { children: React.ReactNode }) => {
	const { status } = useSession();

	useEffect(() => {
		if (status === "authenticated") {
			socketManager.connect();
		}
	}, [status]);

	useEffect(() => {
		return () => {
			if (socketManager.isConnected()) {
				socketManager.disconnect();
			}
		};
	}, []);

	if (status === "loading") {
		return <div>Loading...</div>;
	}

	return <>{children}</>;
};
