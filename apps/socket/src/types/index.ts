export interface BaseUser {
	id: string;
	name: string | null;
	username: string;
	coins: number;
	image: string | null;
}

export interface SocketUser extends BaseUser {
    socketId: string;
}