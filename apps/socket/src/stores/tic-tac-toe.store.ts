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
	 * Clear all tic tac toe rooms
	 */
	public clear() {
		this.ticTacToeRooms.clear();
	}

}

export const ticTacToeStore = TicTacToeStore.getInstance();