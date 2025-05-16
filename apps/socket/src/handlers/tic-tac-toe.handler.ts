import { GameEvent, GameEvents } from "../constants/game-events.constants.js";
import { EventHandler } from "./handler.js";
import { SocketUser } from "../types/index.js";
import { TicTacToeRoom } from "../rooms/tic-tac-toe.room.js";
import { userStore, ticTacToeStore } from "../stores";

export class TicTacToeHandler extends EventHandler {
	protected readonly nameSpace: string = "games";
	protected readonly subNameSpace: string | null = "tic-tac-toe";
	protected readonly events: GameEvent[] = [...GameEvents];

	private isPlayerAvailable(playerId: string): boolean {
		return userStore.getstatusByuserId(playerId) === "idle";
	}

	/**
	 * Handles the new Tic-Tac-Toe room creation.
	 *
	 * - Verifies if the user is authenticated.
	 * - Ensures the player is not already in a room.
	 * - Creates a new room and adds the player as "X".
	 * - Joins the socket to the new room and updates the user status to "waiting".
	 * - Stores the new room in the global Tic-Tac-Toe store.
	 * - Sends a success response with the sanitized room data.
	 *
	 * @returns {void}
	 *
	 * @emits failure if the user is not authenticated or if the player is already in a room.
	 * @emits success with the sanitized room data.
	 */
	create(): void {
		const player = this.socket.data.user as SocketUser;

		if (!player) {
			return this.failure("Unauthorized user");
		}

		if (!this.isPlayerAvailable(player.id)) {
			return this.failure("You are already in the room");
		}

		const room = new TicTacToeRoom(true);
		room.addPlayer(player, "X");
		room.hostId = player.id;

		this.socket.join(room.roomId);
		ticTacToeStore.addRoom(room.roomId, room);
		userStore.setStatus(player.id, "waiting");

		this.success({ room: room.sanitizeRoom });
	}

	/**
	 * Handles the joining of a Tic-Tac-Toe room.
	 *
	 * - Verifies if the user is authenticated.
	 * - Checks if the room exists.
	 * - Checks if the room is full.
	 * - Checks if the player is already in the room.
	 * - Adds the player to the room and joins the socket to the room.
	 * - Updates the user status to "waiting".
	 * - Sends a success response with the sanitized room data.
	 * - Sends a response to opponent that emits the `opponent-joined` event.
	 *
	 * @param {string} roomId - The ID of the room to join.
	 *
	 * @returns {void}
	 *
	 * @emits failure if the user is not authenticated, the room does not exist, the room is full, or the player is already in the room.
	 * @emits success with the sanitized room data.
	 */
	join(roomId: string): void {
		const player = this.socket.data.user as SocketUser;

		if (!player) {
			this.failure("Unauthorized user");
			return;
		}

		const room = ticTacToeStore.getRoom(roomId);
		if (!room) {
			return this.failure("Room not found");
		}

		if (room.isFull) {
			return this.failure("Room is full");
		}

		if (this.isPlayerAvailable(player.id)) {
			return this.failure("You are already in the room");
		}

		room.addPlayer(player, "O");
		this.socket.join(room.roomId);
		userStore.setStatus(player.id, "waiting");

		this.success({ room: room.sanitizeRoom });

		const opponent = room.getOpponent(player.socketId);
		if (opponent) {
			this.io
				.to(opponent.socketId)
				.emit("games:tic-tac-toe:opponent-joined", { room: room.sanitizeRoom });
		}
	}

	/**
	 * Handles the random Tic-Tac-Toe room creation.
	 *
	 * - Verifies if the user is authenticated.
	 * - Player not already in a room.
	 * - Check the availabile random rooms.
	 * - If no random room is available, create a new room.
	 * - Add the player to the room and join the socket to the room.
	 * - Update the user status to "waiting".
	 * - Send a success response with the sanitized room data.
	 *
	 * @returns {void}
	 *
	 * @emits failure if the user is not authenticated or if the player is already in a room.
	 * @emits success with the sanitized room data.
	 */
	random(): void {
		const player = this.socket.data.user as SocketUser;

		if (!player) {
			return this.failure("Unauthorized user");
		}

		if (!this.isPlayerAvailable(player.id)) {
			return this.failure("You are already in the room");
		}

		const rooms = ticTacToeStore.getRandom();
		const room = rooms[Math.floor(Math.random() * rooms.length)];

		if (!room) {
			const newRoom = new TicTacToeRoom(false);
			ticTacToeStore.addRoom(newRoom.roomId, newRoom);

			newRoom.addPlayer(player, "X");
			this.socket.join(newRoom.roomId);
			userStore.setStatus(player.id, "waiting");

			return this.success({ room: newRoom.sanitizeRoom });
		}

		room.addPlayer(player, "O");
		this.socket.join(room.roomId);
		userStore.setStatus(player.id, "waiting");

		this.success({ room: room.sanitizeRoom });
		const opponent = room.getOpponent(player.socketId);
		if (opponent) {
			this.io
				.to(opponent.socketId)
				.emit("games:tic-tac-toe:opponent-joined", { room: room.sanitizeRoom });
		}

		setTimeout(() => {
			this.start(room.roomId);
		}, 5000);
	}

	/**
	 * Starts the game for the Tic-Tac-Toe room.
	 *
	 * - Verifies if the user is authenticated.
	 * - Checks if the room exists.
	 * - Checks if the room is full.
	 * - Checks if the player is the host.
	 * - Updates the user status to "playing".
	 * - Sends a success response with the sanitized room data.
	 *
	 * @param {string} roomId - The ID of the room to start.
	 *
	 * @returns {void}
	 *
	 * @emits failure if the user is not authenticated, the room does not exist, the room is not full, or the player is not the host.
	 * @emits success with the sanitized room data.
	 */
	start(roomId: string): void {
		const player = this.socket.data.user as SocketUser;
		if (!player) {
			return this.failure("Unauthorized user");
		}

		const room = ticTacToeStore.getRoom(roomId);
		if (!room) {
			return this.failure("Room not found");
		}

		if (room.isFull) {
			return this.failure("Room is full");
		}

		if (player.id !== room.hostId && !room.isRandomRoom) {
			return this.failure("You are not the host");
		}

		userStore.setStatus(player.id, "playing");
		const opponent = room.getOpponent(player.socketId);
		if (opponent) {
			userStore.setStatus(opponent.id, "playing");
		}
		this.broadcast("games:tic-tac-toe:start", room.roomId, { room: room.sanitizeRoom });
	}

	move(data: { roomId: string; cell: number }) {
		try {
			const player = this.socket.data.user as SocketUser;
			if (!player) {
				return this.failure("Unauthorized user");
			}

			const room = ticTacToeStore.getRoom(data.roomId);
			if (!room) {
				return this.failure("Room not found");
			}

			if (room.isPlayer(player.socketId)) {
				room.move(player.id, data.cell);
				this.broadcast("games:tic-tac-toe:move", room.roomId, { room: room.sanitizeRoom });
			}

			this.checkDraw(room.roomId);
			this.checkWinner(room.roomId);
		} catch (error: any) {
			this.failure(error?.message || "Something went wrong");
		}
	}

	end(data: any): void {
		this.success(data);
	}

	leave(data: { roomId: string; playerId: string }) {
		const player = this.socket.data.user as SocketUser;
		const room = ticTacToeStore.getRoom(data.roomId);
		if (room) {
			room.removePlayer(player.socketId);

			if (
				room.isRandomRoom ||
				room.hostId === player.id ||
				room.players.length === 0 ||
				room.gameStatus === "finished"
			) {
				this.broadcast("games:tic-tac-toe:leave", room.roomId, { room: room.sanitizeRoom });

				ticTacToeStore.remove(room.roomId);
				this.socket.leave(room.roomId);

				userStore.setStatus(player.id, "idle");
				const opponent = room.getOpponent(player.socketId);
				if (opponent) {
					userStore.setStatus(opponent.id, "idle");
					this.socket.nsp.socketsLeave(room.roomId);
				}
			}

			this.broadcast("games:tic-tac-toe:player-left", room.roomId, {
				room: room.sanitizeRoom,
			});
		}
	}

	private checkWinner(roomId: string): void {
		const room = ticTacToeStore.getRoom(roomId);
		if (room) {
			const winnerSymbol = room.checkWinner();
			if (winnerSymbol) {
				room.winnerId =
					room.players.find((player) => player.symbol === winnerSymbol)?.id || null;
				room.gameStatus = "finished";

				this.broadcast("games:tic-tac-toe:end", room.roomId, { room: room.sanitizeRoom });
			}
		}
	}

	private checkDraw(roomId: string): void {
		const room = ticTacToeStore.getRoom(roomId);
		if (room) {
			if (room.checkDraw()) {
				room.gameStatus = "finished";
				this.broadcast("games:tic-tac-toe:end", room.roomId, { room: room.sanitizeRoom });
			}
		}
	}
}
