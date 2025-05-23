import React from "react";
import { gameSettingsReducer, initialState } from "@/games/settings/game-settings.reducer";
import type {
	GameMode,
	GameSettingsActions,
	OnlineMode,
	PrivateRoomOption,
} from "@/types/game-settings.type";
import {
	GameSettingsActionsContext,
	GameSettingsContext,
} from "@/games/settings/game-settings.context";

export const GameSettingsProvider = ({ children }: { children: React.ReactNode }) => {
	const [gameSettings, dispatch] = React.useReducer(gameSettingsReducer, initialState);

	const setMode = (mode: GameMode) => {
		dispatch({ type: "SET_MODE", payload: mode });
	};
	const setOnlineMode = (onlineMode: OnlineMode) => {
		dispatch({ type: "SET_ONLINE_MODE", payload: onlineMode });
	};
	const setPrivateRoomOption = (privateRoomOption: PrivateRoomOption) => {
		dispatch({ type: "SET_PRIVATE_ROOM_OPTION", payload: privateRoomOption });
	};
	const setCoins = (coins: number) => {
		dispatch({ type: "SET_COINS", payload: coins });
	};
	const reset = () => {
		dispatch({ type: "RESET" });
	};

	const actions: GameSettingsActions = {
		setMode,
		setOnlineMode,
		setPrivateRoomOption,
		setCoins,
		reset,
	};

	return (
		<GameSettingsContext.Provider value={gameSettings}>
			<GameSettingsActionsContext.Provider value={actions}>
				{children}
			</GameSettingsActionsContext.Provider>
		</GameSettingsContext.Provider>
	);
};
