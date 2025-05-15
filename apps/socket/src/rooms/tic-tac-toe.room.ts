import { SocketUser } from "types";
import { Room } from "./room";

type TicTacToeSymbol = "X" | "O";

type TicTacToePlayer = SocketUser & {
	symbol: TicTacToeSymbol;
};

export class TicTacToeRoom extends Room<TicTacToePlayer> {
	protected players: TicTacToePlayer[];
	protected board: (TicTacToeSymbol | null)[];

	/**
	 * Constructor
	 * @param isPrivate {boolean}
	 */
	constructor(isPrivate: boolean) {
		super(isPrivate);
		this.players = [];
		this.board = [];
	}

	/**
	 * Initialize the board
	 */
	initBoard(): void {
		this.board = Array(9).fill(null);
	}

	/**
	 * Add a player to the room
	 * @param player {SocketUser}
	 * @param symbol {TicTacToeSymbol}
	 */
	addPlayer(player: SocketUser, symbol: TicTacToeSymbol): void {
		this.players.push({ ...player, symbol });
	}

	get sanitizeRoom() {
		return {
			roomId: this._roomId,
			roomCode: this._roomCode,
			players: this.players,
			board: this.board,
			currentPlayerId: this.currentPlayerId,
			status: this.status,
			winner: this.winner,
		};
	}
}
