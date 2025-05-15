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
    
    public totalNoOfRooms() {
        const noOfTicTacToeGames = ticTacToeStore.noOfRooms;
        return noOfTicTacToeGames;
    }

	/**
	 * Clear all store
	 */
	public clear() {
		ticTacToeStore.clear();
	}
}

export const gamesStore = GamesStore.getInstance();
