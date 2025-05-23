import { TicTacToeRoom } from "rooms/tic-tac-toe.room";

export class TicTacToeStore {
	private static instance: TicTacToeStore;

	// Map of room id to tic tac toe room
	private ticTacToeRooms: Map<string, TicTacToeRoom> = new Map();

	public static getInstance() {
		if (!TicTacToeStore.instance) {
			TicTacToeStore.instance = new TicTacToeStore();
		}
		return TicTacToeStore.instance;
	}

	/**
	 * Get tic tac toe room
	 * @param roomId
	 * @returns {TicTacToeRoom | undefined}
	 */
	public getRoom(roomId: string): TicTacToeRoom | undefined {
		return this.ticTacToeRooms.get(roomId);
	}

	/**
	 * Get tic tac toe room via room code
	 * @param roomCode
	 * @returns {TicTacToeRoom | undefined}
	 */
	public getRoomByRoomCode(roomCode: string): TicTacToeRoom | undefined {
		return Array.from(this.ticTacToeRooms.values()).find((room) => room.roomCode === roomCode);
	}

	/**
	 * Add tic tac toe room
	 * @param roomId
	 * @param room
	 */
	public addRoom(roomId: string, room: TicTacToeRoom) {
		this.ticTacToeRooms.set(roomId, room);
	}

	/**
	 * Total no of tic tac toe rooms
	 * @returns {number}
	 */
	public get noOfRooms(): number {
		return this.ticTacToeRooms.size;
	}

	/**
	 * Remove tic tac toe room
	 * @param roomId
	 */
	public remove(roomId: string) {
		this.ticTacToeRooms.delete(roomId);
	}

	/**
	 * Get all tic tac toe rooms
	 * @returns {Map<string, TicTacToeRoom>}
	 */
	public getAll(): Map<string, TicTacToeRoom> {
		return this.ticTacToeRooms;
	}

	/**
	 * Get all random tic tac toe rooms
	 *
	 * - isPrivate = false and no of players < maxPlayers
	 *
	 * @returns {TicTacToeRoom[]}
	 */
	public getRandom(): TicTacToeRoom[] {
		const rooms: TicTacToeRoom[] = [];
		this.ticTacToeRooms.forEach((room) => {
			if (room.isAvailableRandomRoom) {
				rooms.push(room);
			}
		});
		return rooms;
	}

	/**
	 * Get room by socket id
	 * @param socketId
	 * @returns {TicTacToeRoom | undefined}
	 */
	public getRoomBySocketId(socketId: string): TicTacToeRoom | undefined {
		return Array.from(this.ticTacToeRooms.values()).find((room) => room.isPlayer(socketId));
	}

	/**
	 * Clear all tic tac toe rooms
	 */
	public clear() {
		this.ticTacToeRooms.clear();
	}
}

export const ticTacToeStore = TicTacToeStore.getInstance();
