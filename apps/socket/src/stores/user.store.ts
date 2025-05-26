import { logger } from "../utils/logger.js";
import { GameStatus, SocketUser } from "../types/index.js";
import { Socket } from "socket.io";

export class UserStore {
	private static instance: UserStore;
	// socketId -> user
	private users: Map<string, SocketUser> = new Map();

	// userId -> socketId
	private userIdToSocketId: Map<string, string> = new Map();

	// userId -> status
	private userStatus: Map<string, GameStatus> = new Map();

	/**
	 * Get instance
	 * @returns {UserStore}
	 */
	public static getInstance(): UserStore {
		if (!UserStore.instance) {
			UserStore.instance = new UserStore();
		}
		return UserStore.instance;
	}

	/**
	 * Add user
	 * @param user
	 */
	public add(socket: Socket) {
		const user: SocketUser = socket.data.user;

		// check if user already exists update socketId and disconnect old socket
		if (this.userIdToSocketId.has(user.id)) {
			// disconnect old socket
			socket.nsp.sockets.get(this.userIdToSocketId.get(user.id)!)?.disconnect();
			logger.error(`[UserStore] ${user.id} already exists`);

			// update socketId
			this.users.delete(this.userIdToSocketId.get(user.id)!);
			this.users.set(user.socketId, user);
			this.userIdToSocketId.set(user.id, user.socketId);
			this.userStatus.set(user.id, "idle");
			logger.info(`[UserStore] ${user.socketId} updated`);
			return;
		}
		// Create new user
		this.users.set(user.socketId, user);
		this.userIdToSocketId.set(user.id, user.socketId);
		this.userStatus.set(user.id, "idle");
		logger.info(`[UserStore] ${user.socketId} added`);
	}

	/**
	 * Remove user by socketId
	 * @param socketId
	 */
	public remove(socketId: string) {
		logger.info(`User ${socketId} removed`);
		const user = this.users.get(socketId);
		if (user) {
			this.users.delete(socketId);
			this.userIdToSocketId.delete(user.id);
			this.userStatus.delete(user.id);
		}
	}

	/**
	 * Get user by socketId
	 * @param socketId
	 * @returns {SocketUser | undefined}
	 */
	public get(socketId: string): SocketUser | undefined {
		return this.users.get(socketId);
	}

	/**
	 * Get socketId by userId
	 * @param userId
	 * @returns {string | undefined}
	 */
	public getSocketId(userId: string): string | undefined {
		return this.userIdToSocketId.get(userId);
	}

	/**
	 * Get status by userId
	 * @param userId
	 * @returns {GameStatus | undefined}
	 */
	public getstatusByuserId(userId: string): GameStatus | undefined {
		return this.userStatus.get(userId);
	}

	/**
	 * Get status by socketId
	 * @param socketId
	 * @returns {GameStatus | undefined}
	 */
	public getstatusBySocketId(socketId: string): GameStatus | undefined {
		const user = this.users.get(socketId);
		return user ? this.userStatus.get(user.id) : undefined;
	}

	/**
	 * Set status by userId
	 * @param userId
	 * @param status
	 */
	public setStatus(userId: string, status: GameStatus) {
		this.userStatus.set(userId, status);
	}

	/**
	 * Get all users
	 * @returns {SocketUser[]}
	 */
	public getAll(): SocketUser[] {
		return Array.from(this.users.values());
	}

	/**
	 * Clear all users
	 */
	public clear() {
		this.users.clear();
	}
}

export const userStore = UserStore.getInstance();
