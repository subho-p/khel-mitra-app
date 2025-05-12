import { logger } from "../utils/logger.js";
import { SocketUser } from "../types";

export class UserStore{
    private static instance: UserStore;
    // socketId -> user
    private users: Map<string, SocketUser> = new Map();

    public static getInstance(): UserStore {
        if (!UserStore.instance) {
            UserStore.instance = new UserStore();
        }
        return UserStore.instance;
    }

    public add(user: SocketUser) {
        logger.info(`User ${user.socketId} added`);
        this.users.set(user.socketId, user);
    }

    public remove(socketId: string) {
        logger.info(`User ${socketId} removed`);
        this.users.delete(socketId);
    }

    public get(socketId: string): SocketUser | undefined {
        return this.users.get(socketId);
    }

    public getAll(): SocketUser[] {
        return Array.from(this.users.values());
    }

    public clear() {
        this.users.clear();
    }
}
