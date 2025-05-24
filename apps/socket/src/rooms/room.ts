import { GameStatus, SocketUser } from "types";

export abstract class Room<T extends { id: string; socketId: string }> {
	protected _roomId: string;
	protected _roomCode: string;
	abstract players: T[];
	abstract board: any[];

	protected currentPlayerId: string | null;
	protected status: GameStatus;
	winnerId: string | null;

	hostId?: string;
	isPrivate: boolean;
	protected maxPlayers: number;
	maxNoOfSkips: number;

	protected createdAt: number;
	protected updatedAt: number;

	/**
	 * Constructor
	 * @param isPrivate {boolean}
	 */
	constructor(isPrivate: boolean) {
		this.isPrivate = isPrivate;
		this.maxPlayers = 2;
		this.maxNoOfSkips = 2;
		this.createdAt = Date.now();
		this.updatedAt = Date.now();

		this._roomId = this.generateRoomId();
		this._roomCode = this.generateRoomCode();

		this.currentPlayerId = null;
		this.status = "waiting";
		this.winnerId = null;
	}

	abstract move(...args: any): void;

	/**
	 * Generate room id
	 * @returns {string}
	 */
	private generateRoomId(): string {
		return crypto.randomUUID();
	}

	/**
	 * Generate room code
	 * @returns {string}
	 */
	private generateRoomCode(): string {
		return this._roomId.slice(0, 6);
	}

	/**
	 * Get room id
	 * @returns {string}
	 */
	get roomId(): string {
		return this._roomId;
	}

	/**
	 * Get room code
	 * @returns {string}
	 */
	get roomCode(): string {
		return this._roomCode;
	}

	/**
	 * Set game status
	 * @param status
	 */
	set gameStatus(status: GameStatus) {
		this.status = status;
	}

	/**
	 * Add player to room
	 * @param player
	 * @param args - { symbol }
	 */
	abstract addPlayer(player: SocketUser, ...args: any): void;

	/**
	 * Reset room
	 */
	reset(): void {
		this.initBoard();
		this.currentPlayerId = null;
		this.status = "waiting";
		this.winnerId = null;
	}

	/**
	 * Check if room is full
	 * @returns {boolean}
	 */
	get isFull(): boolean {
		return this.players.length === this.maxPlayers;
	}

	/**
	 * Check if player is in room
	 * @param player
	 * @returns {boolean}
	 */
	isPlayer(socketId: string): boolean {
		return this.players.some((p) => p.socketId === socketId);
	}

	/**
	 * Remove player from room
	 * @param socketId
	 */
	removePlayer(socketId: string): void {
		this.players = this.players.filter((player) => player.socketId !== socketId);
	}

	/**
	 * Check if player is turn
	 * @param player
	 * @returns {boolean}
	 */
	isPlayerTurn(player: T): boolean {
		return this.currentPlayerId === player.socketId;
	}

	/**
	 * Check if player is current player
	 * @param player
	 * @returns {T | undefined}
	 */
	isCurrentPlayer(player: T): T | undefined {
		return this.players.find((p) => p.socketId === player.socketId);
	}

	/**
	 * Get current player
	 * @returns {T | undefined}
	 */
	getCurrentPlayer(): T | undefined {
		return this.players.find((p) => p.id === this.currentPlayerId);
	}

	/**
	 * Get opponent
	 * @param player
	 * @returns {T | null}
	 */
	getOpponent(socketId: string): T | null {
		return this.players.find((p) => p.socketId !== socketId) || null;
	}

	/**
	 * Get is random room
	 *
	 * @returns {boolean}
	 */
	get isRandomRoom(): boolean {
		return !this.isPrivate;
	}

	/**
	 * Get is available random
	 *
	 * - isPrivate = false and players.length < maxPlayers
	 *
	 * @returns {boolean}
	 */
	get isAvailableRandomRoom(): boolean {
		return !this.isPrivate && this.players.length < this.maxPlayers;
	}

	/**
	 * Next turn
	 */
	nextTurn(): void {
		this.currentPlayerId = this.players.find((p) => p.id !== this.currentPlayerId)?.id || null;
	}

	/**
	 * Get sanitized room
	 */
	get sanitizeRoom() {
		return {
			roomId: this.roomId,
			roomCode: this.roomCode,
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

	/**
	 * Initialize board
	 */
	abstract initBoard(): void;
}
