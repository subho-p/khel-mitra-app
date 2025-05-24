import type { Player } from "./player.type";

export type TicTacToeSymbol = "X" | "O";

export interface TicTacToePlayer extends Player {
	symbol: TicTacToeSymbol;
}

export interface TicTacToeRoom {
	roomId: string;
	roomCode: string;
	players: TicTacToePlayer[];
	board: (TicTacToeSymbol | null)[];
	currentPlayerId: string | null;
	status: string;
	winnerId: string | null;
	hostId: string;
	isPrivate: boolean;
	maxPlayers: number;
}
