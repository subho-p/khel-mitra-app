"use client";

import { useReducer, useState } from "react";
import { createReactContext } from "@/providers/createReactContext";

export type Mode = "online" | "offline";
export type OnlineMode = "random" | "custom";
export type Token = 100 | 200 | 500 | 1000;

type GameFlow = "idle" | "local" | "random-online" | "create-room" | "join-room";

type GameSettings = {
	mode?: Mode;
	onlineMode?: OnlineMode;
	isAdmin?: boolean;
	token: Token;
};

type Action =
	| { type: "SET_MODE"; payload: Mode }
	| { type: "SET_ONLINE_MODE"; payload: OnlineMode }
	| { type: "SET_TOKEN"; payload: number }
	| { type: "SET_IS_ADMIN"; payload: boolean }
	| { type: "RESET" };

function reducer(state: GameSettings, action: Action) {
	switch (action.type) {
		case "SET_MODE":
			return { ...initalState, mode: action.payload };
		case "SET_ONLINE_MODE":
			return { ...state, onlineMode: action.payload, isAdmin: undefined };
		case "SET_IS_ADMIN":
			return { ...state, isAdmin: action.payload, token: 100 as Token };
		case "SET_TOKEN":
			return { ...state, token: action.payload as Token };
		case "RESET":
			return initalState;
		default:
			return state;
	}
}

const initalState: GameSettings = { token: 100 };

export const GameSettings = createReactContext(() => {
	const [gameFlow, setGameFlow] = useState<GameFlow>("idle");
	const [state, dispatch] = useReducer(reducer, initalState);

	function selectMode(arg: Mode) {
		dispatch({ type: "SET_MODE", payload: arg });
	}

	function selectOnlineMode(arg: OnlineMode) {
		dispatch({ type: "SET_ONLINE_MODE", payload: arg });
	}

	function selectNoOfTokens(token: number) {
		dispatch({ type: "SET_TOKEN", payload: token });
	}

	function setAdmin(flag: boolean) {
		dispatch({ type: "SET_IS_ADMIN", payload: flag });
	}

	function onChangeGameFlow(flow: GameFlow) {
		setGameFlow(flow);
	}

	return {
		...state,
        gameFlow,
		selectMode,
		selectOnlineMode,
		selectNoOfTokens,
		setAdmin,
		onChangeGameFlow,
		dispatch,
	};
}, "GameSettings");

export const useGameSettings = GameSettings.use;
export const GameSettingsProvider = GameSettings.Provider;
