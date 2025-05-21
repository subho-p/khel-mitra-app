import { Socket, io } from "socket.io-client";

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

		this._socket = io("http://localhost:6789", {
			transports: ["websocket"],
			reconnection: true,
			reconnectionAttempts: Infinity,
			reconnectionDelay: 1000,
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
}

export const socket = SocketManager.getInstance();
