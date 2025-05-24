import { useEffect, useReducer } from "react";
import { useAuth } from "@/contexts/auth.context";
import { createReactContext } from "@/lib/createReactContext";
import type { GameEndStutus, TicTacToeRoom } from "@/types";

interface OnlineTictactoe {
	room: TicTacToeRoom | null;
	isReadyToPlay: boolean;
	isStarted: boolean;
}

type OnlineTictactoeReducerActions =
	| { type: "SET_ROOM"; payload: TicTacToeRoom }
	| { type: "SET_IS_READY_TO_PLAY"; payload: { flag: boolean; room: TicTacToeRoom } }
	| { type: "SET_IS_STARTED"; payload: { flag: boolean; room: TicTacToeRoom } }
	| { type: "CLEAR_ROOM" };

function OnlineTictactoeReducer(state: OnlineTictactoe, action: OnlineTictactoeReducerActions) {
	switch (action.type) {
		case "SET_ROOM":
			return { ...state, room: action.payload };
		case "SET_IS_READY_TO_PLAY":
			return { ...state, isReadyToPlay: action.payload.flag, room: action.payload.room };
		case "SET_IS_STARTED":
			return { ...state, isStarted: action.payload.flag, room: action.payload.room };
		case "CLEAR_ROOM":
			return { ...state, room: null, isReadyToPlay: false, isStarted: false };
		default:
			throw new Error("Unknown action type");
	}
}

const initialState: OnlineTictactoe = {
	room: null,
	isReadyToPlay: false,
	isStarted: false,
};

// Game End
interface GameEndState {
	status: GameEndStutus | null;
	message: string | null;
	isReady: boolean;
}

type GameEndReducerActions =
	| { type: "SET_DATA"; payload: GameEndState }
	| { type: "SET_GAME_END_STATUS"; payload: GameEndStutus }
	| { type: "SET_GAME_END_STATUS_MESSAGE"; payload: string }
	| { type: "SET_IS_READY"; payload: boolean }
	| { type: "RESET" };

function GameEndReducer(state: GameEndState, action: GameEndReducerActions): GameEndState {
	switch (action.type) {
		case "SET_DATA":
			return { ...state, ...action.payload };
		case "SET_GAME_END_STATUS":
			return { ...state, status: action.payload };
		case "SET_GAME_END_STATUS_MESSAGE":
			return { ...state, message: action.payload };
		case "SET_IS_READY":
			return { ...state, isReady: action.payload };
		default:
			throw new Error("Unknown action type");
	}
}

const OnlineTictactoeContext = createReactContext(() => {
	const { user } = useAuth();

	const [gameEndState, gameEndStateDispatch] = useReducer(GameEndReducer, {
		status: null,
		message: null,
		isReady: false,
	});
	const [onlineTictactoeState, dispatch] = useReducer(OnlineTictactoeReducer, initialState);

	const isHost = () => onlineTictactoeState.room?.hostId === user?.id;
	const isMe = (id: string) => id === user?.id;
	const isOpponent = (id: string) => id !== user?.id;
	const isReady = () => onlineTictactoeState.isReadyToPlay;

	const setRoom = (room: TicTacToeRoom) => {
		dispatch({ type: "SET_ROOM", payload: room });
	};

	const setIsReadyToPlay = (flag: boolean, room: TicTacToeRoom) => {
		dispatch({ type: "SET_IS_READY_TO_PLAY", payload: { flag, room } });
	};

	const setIsStarted = (flag: boolean, room: TicTacToeRoom) => {
		dispatch({ type: "SET_IS_STARTED", payload: { flag, room } });
	};

	const handleOnlineTictactoeStoreReset = () => {
		dispatch({ type: "CLEAR_ROOM" });
	};

	// cleanup function
	useEffect(() => {
		return () => {
			handleOnlineTictactoeStoreReset();
			gameEndStateDispatch({ type: "RESET" });
		};
	}, []);

	return {
		...onlineTictactoeState,
		isHost,
		isMe,
		isOpponent,
		isReady,
		setRoom,
		setIsReadyToPlay,
		setIsStarted,
		handleOnlineTictactoeStoreReset,
		gameEndState,
		gameEndStateDispatch,
	};
}, "Online Tictactoe");

const OnlineTictactoeProvider = OnlineTictactoeContext.Provider;
const useOnlineTictactoe = OnlineTictactoeContext.useContext;

export { OnlineTictactoeProvider, useOnlineTictactoe };
