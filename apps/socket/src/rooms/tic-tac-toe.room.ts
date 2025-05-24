import { Player, SocketUser } from "types";
import { Room } from "./room";

type TicTacToeSymbol = "X" | "O";

type TicTacToePlayer = Player & {
	symbol: TicTacToeSymbol;
};

export class TicTacToeRoom extends Room<TicTacToePlayer> {
	players: TicTacToePlayer[];
	board: (TicTacToeSymbol | null)[] = Array(9).fill(null);

	/**
	 * Constructor
	 * @param isPrivate {boolean}
	 */
	constructor(isPrivate: boolean) {
		super(isPrivate);
		this.players = [];
		this.board = Array(9).fill(null);
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

	/**
	 * Start the game
	 * @returns {void}
	 */
	start(): void {
		this.initBoard();
		this.currentPlayerId = this.players[0]!.id;
		this.status = "playing";
	}

	/**
	 * Move a player
	 * @param data {playerId: string; cell: number}
	 */
	move(playerId: string, cell: number): void {
		try {
			if (this.checkAvailableMoves().length === 0) {
				throw new Error("Game is over");
			}
			const currentPlayer = this.getCurrentPlayer();
			const isCurrentPlayer = currentPlayer?.id === playerId;
			if (!isCurrentPlayer) {
				throw new Error("It's not your turn");
			}

			if (this.board[cell]) {
				throw new Error("Cell is already taken");
			}

			if (cell < 0 || cell > 8) {
				throw new Error("Invalid cell");
			}

			this.board[cell] = this.getCurrentPlayer()?.symbol!;
			this.nextTurn();
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Check available moves
	 * @returns {number[]}
	 */
	checkAvailableMoves(): number[] {
		return this.board.reduce((acc, cell, index) => {
			if (cell === null) {
				acc.push(index);
			}
			return acc;
		}, [] as number[]);
	}

	/**
	 * Check winner
	 * @returns {TicTacToeSymbol}
	 */
	checkWinner(): TicTacToeSymbol | null {
		const winningCombinations = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		] as const;


		let winnerSymbol: TicTacToeSymbol | null = null;
		winningCombinations.forEach((combination) => {
			const [a, b, c] = combination;

			if (
				this.board[a] !== null &&
				this.board[a] === this.board[b] &&
				this.board[a] === this.board[c]
			) {
				winnerSymbol = this.board[a]!;
			}
		});

		return winnerSymbol;
	}

	/**
	 * Check draw
	 * @returns {boolean}
	 */
	checkDraw(): boolean {
		return this.board.every((cell) => cell !== null);
	}

	get sanitizeRoom() {
		return {
			roomId: this._roomId,
			roomCode: this._roomCode,
			players: this.players,
			board: this.board,
			currentPlayerId: this.currentPlayerId,
			status: this.status,
			winnerId: this.winnerId,
			hostId: this.hostId,
			isPrivate: this.isPrivate,
			maxPlayers: this.maxPlayers,
		};
	}
}
