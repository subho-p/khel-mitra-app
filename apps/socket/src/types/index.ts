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

export interface Player extends SocketUser {
	isAdmin?: boolean;
	isReady?: boolean;
	isHost?: boolean;
	isTurn?: boolean;
	noOfSkips?: number;
	noOfWins?: number;
}

export type GameStatus = "idle" | "waiting" | "playing" | "finished";
