export type GameMode = "online" | "local";
export type OnlineMode = "public" | "private";
export type PrivateRoomOption = "create" | "join";
export type GameEndStutus = "win" | "lose" | "draw";

export interface GameSettings {
	mode?: GameMode;
	onlineMode?: OnlineMode;
	privateRoomOption?: PrivateRoomOption;
	coins: number;
}

export interface GameSettingsActions {
	setMode: (mode: GameMode) => void;
	setOnlineMode: (onlineMode: OnlineMode) => void;
	setPrivateRoomOption: (privateRoomOption: PrivateRoomOption) => void;
	setCoins: (coins: number) => void;
	reset: () => void;
}

export type GameSettingsReducerActions =
	| { type: "SET_MODE"; payload: GameMode }
	| { type: "SET_ONLINE_MODE"; payload: OnlineMode }
	| { type: "SET_PRIVATE_ROOM_OPTION"; payload: PrivateRoomOption }
	| { type: "SET_COINS"; payload: number }
	| { type: "RESET" };
