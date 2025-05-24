export interface Player {
	id: string;
	name: string | null;
	username: string;
	coins: number;
	image: string | null;
	socketId: string;
}

export type GameFlow = "idle" | "localGame" | "randomGame" | "createRoom" | "joinRoom";
