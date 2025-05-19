import { SocketResponse } from "@/types/socket.types";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { handleSocketResponse } from "./socket.utils";

type SocketEventHandler = {
	event: string;
	handler: (...args: any[]) => void;
};

export class SocketManager {
	private static instance: SocketManager;
	private _socket: Socket | null = null;
	private registeredHandlers: SocketEventHandler[] = [];

	constructor() {}

	public static getInstance(): SocketManager {
		if (!SocketManager.instance) {
			SocketManager.instance = new SocketManager();
		}

		return SocketManager.instance;
	}

	get socket() {
		return this._socket;
	}

	public connect() {
		if (this._socket && this._socket.connected) {
			console.log("Socket already connected");
			return;
		}

		this._socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
			transports: ["websocket"],
			reconnection: true,
			reconnectionAttempts: Infinity,
			reconnectionDelay: 1000,
		});

		this._socket.on("connect", () => {
			console.log("Socket connected:", this._socket?.id);

			this._socket?.on("app:toast", ({ data }) => {
				toast(data);
				this._socket?.off("app:toast");
			});
		});

		this._socket.on("disconnect", (reason) => {
			console.log("Socket disconnected:", reason);
		});

		this._socket.on("connect_error", (error) => {
			console.error("Socket connection error:", error.message);
		});
	}

	public registerEvent(event: string, handler: (...args: any[]) => void) {
		this.registeredHandlers.push({ event, handler });

		if (this._socket && this._socket.connected) {
			this._socket.on(event, handler);
		}
	}

	private registerHandlers() {
		if (!this._socket) {
			return;
		}

		this.registeredHandlers.forEach(({ event, handler }) => {
			this._socket?.on(event, handler);
		});
	}

	public emit(event: string, data: any, callback?: (...args: any[]) => void) {
		if (!this._socket) throw new Error("Socket not connected");

		this._socket.emit(event, data, callback);
	}

	public emitWithAck<T>(event: string, data: object): Promise<T | null> {
		if (!this._socket || !this._socket.connected) {
			this.connect();
		}

		return new Promise((resolve, reject) => {
			this._socket?.emit(event, data, (res: SocketResponse<T>) => {
				handleSocketResponse(res, {
					onSuccess: (data) => {
						resolve(data);
					},
					onError: (message) => {
						reject(message);
					},
				});
			});
		});
	}

	public off(event: string, handler: (...args: any[]) => void) {
		if (!this._socket) throw new Error("Socket not connected");

		this._socket.off(event, handler);
	}

	public disconnect() {
		if (this._socket) {
			this._socket.disconnect();
			this._socket = null;
			this.registeredHandlers = [];

			console.log("Socket disconnected");
		}
	}

	public isConnected() {
		return this._socket?.connected ?? false;
	}
}

export const socketManager = SocketManager.getInstance();
