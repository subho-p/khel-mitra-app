import type { SocketResponse } from "@/types/socket.type";
import { Socket, io } from "socket.io-client";
import { handleSocketResponse } from "./socket.utils";
import { delay } from "@/lib/utils";
import { localStore } from "@/lib/localstore-utils";
import { localStorageSchema } from "@/schemas/localstorage.schema";

export class SocketManager {
	private static instance: SocketManager;
	private _socket: Socket | null = null;

	private constructor() {}

	static getInstance() {
		if (!SocketManager.instance) {
			SocketManager.instance = new SocketManager();
		}
		return SocketManager.instance;
	}

	get socket() {
		if (!this._socket) this.connect();
		return this._socket;
	}

	public connect() {
		if (this._socket && this._socket.connected) {
			console.log("Socket already connected");
			return;
		}

		this._socket = io(import.meta.env.VITE_SOCKET_URL, {
			transports: ["websocket"],
			reconnection: true,
			reconnectionAttempts: Infinity,
			reconnectionDelay: 1000,
			auth: {
				access_token: localStore.get("user_status", localStorageSchema.shape.userStatus)
					?.access_token,
			},
		});

		this._socket.on("connect", () => {
			console.log("Socket connected:", this._socket?.id);
		});

		this._socket.on("disconnect", (reason) => {
			console.log("Socket disconnected:", reason);
		});

		this._socket.on("connect_error", (error) => {
			console.error("Socket connection error:", error.message);
		});
	}

	public disconnect() {
		if (this._socket) {
			this._socket.disconnect();
			this._socket = null;
		}
	}

	public async emit(event: string, data: object, callback?: (res: SocketResponse) => void) {
		if (!this._socket || !this._socket.connected) {
			this.connect();
		}

		await this.addDelay();

		this._socket?.emit(event, data, callback);
	}

	public async emitWithAck<T>(event: string, data: object): Promise<T | null> {
		if (!this._socket || !this._socket.connected) {
			this.connect();
		}

		await this.addDelay();

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

	public async on(event: string, handler: (...args: any[]) => void) {
		if (!this._socket) throw new Error("Socket not connected");
		await this.addDelay();

		this._socket.on(event, handler);
	}

	public off(event: string, handler: (...args: any[]) => void) {
		if (!this._socket) throw new Error("Socket not connected");

		this._socket.off(event, handler);
	}

	private async addDelay() {
		if (import.meta.env.VITE_APP_ENV === "development") {
			return await delay(1000);
		}
	}
}

export const socket = SocketManager.getInstance();
