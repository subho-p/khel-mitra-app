import { ticTacToeStore } from "./tic-tac-toe.store";

export class GamesStore {
	private static instance: GamesStore;
	/**
	 * Get instance
	 * @returns {GamesStore}
	 */
	public static getInstance(): GamesStore {
		if (!this.instance) {
			this.instance = new GamesStore();
		}

		return this.instance;
	}

	/**
	 * Total of games
	 * @returns {number}
	 */
	public totalNoOfRooms(): number {
		const noOfTicTacToeGames = ticTacToeStore.noOfRooms;
		return noOfTicTacToeGames;
	}

	/**
	 * All games status
	 * @returns {{ [key: string]: number}}
	 */
	public getAllRoomsStatus(): { [key: string]: number } {
		return {
			"tic-tac-toe": ticTacToeStore.noOfRooms,
		};
	}

	/**
	 * Clear all store
	 */
	public clear() {
		ticTacToeStore.clear();
	}
}

export const gamesStore = GamesStore.getInstance();
