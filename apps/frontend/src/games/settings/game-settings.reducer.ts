import type { GameSettings, GameSettingsReducerActions } from "@/types/game-settings.type";

export const initialState = {
	mode: undefined,
	onlineMode: undefined,
	privateRoomOption: undefined,
	coins: 100,
};

export function gameSettingsReducer(
	state: GameSettings,
	action: GameSettingsReducerActions
): GameSettings {
	switch (action.type) {
		case "SET_MODE":
			return {
				...state,
				mode: action.payload,
				onlineMode: undefined,
				privateRoomOption: undefined,
			};
		case "SET_ONLINE_MODE":
			return {
				...state,
				onlineMode: action.payload,
				privateRoomOption: undefined,
			};
		case "SET_PRIVATE_ROOM_OPTION":
			return {
				...state,
				privateRoomOption: action.payload,
				coins: 100,
			};
		case "SET_COINS":
			return { ...state, coins: action.payload };
		case "RESET":
			return { ...initialState };
		default:
			return state;
	}
}
