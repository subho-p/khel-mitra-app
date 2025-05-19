import { createReactContext } from "@/providers/createReactContext";
import { ticTacToeManager } from "./tic-tac-toe.manager";
import { TicTacToeRoom } from "./types";
import { useEffect, useState } from "react";
import { useSession } from "@/providers/session-provider";
import { toast } from "sonner";

export const TicTacToeSocketContext = createReactContext(() => {
	const [createdRoomCode, setCreatedRoomCode] = useState<string>();
	const [gameStatus, setGameStatus] = useState<
		| "idle"
		| "creatingRoom"
		| "waitingForOpponent"
		| "joiningRoom"
		| "opponentJoinedRoom"
		| "gameStarted"
	>("idle");
	const [isCustomRoom, setIsCustomRoom] = useState(false);

	const [isCreateRoom, setIsCreateRoom] = useState(false);
	const [isOpponentJoined, setIsOpponentJoined] = useState(false);
	const [isGameStarted, setIsGameStarted] = useState(false);
	const [isJoinedRoom, setIsJoinedRoom] = useState(false);

	const [room, setRoom] = useState<TicTacToeRoom>();
	const { user } = useSession();

	const createRoom = async () => {
		try {
			const promise = ticTacToeManager.createRoom();
			toast.promise(promise, {
				loading: "Creating room",
				success: "Room created",
				error: "Failed to create room",
			});
			const res = await promise;
			setRoom(res?.room);
			setCreatedRoomCode(res?.room.roomCode);
			setIsCreateRoom(true);
			setIsCustomRoom(true);
			setGameStatus("waitingForOpponent");

			// lisen on player-joined
			ticTacToeManager.onOpponentJoined((res) => {
				setIsOpponentJoined(true);
				setRoom(res?.room);
				toast.success("Opponent joined");
				setGameStatus("opponentJoinedRoom");
			});
		} catch (error) {
			console.log(error);
		}
	};

	const joinRoom = (roomCode: string) => {
		setGameStatus("joiningRoom");
		toast.promise(
			ticTacToeManager.joinRoom(roomCode).then((res) => {
				setRoom(res?.room);
				setIsJoinedRoom(true);
				setGameStatus("opponentJoinedRoom");
			}),
			{
				loading: "Joining room",
				success: "Joined room",
				error: "Failed to join room",
			}
		);

		ticTacToeManager.onGameStarted((res) => {
			setIsGameStarted(true);
			toast.success("Game started");
			setRoom(res?.room);
			setGameStatus("gameStarted");
		});
	};

	const leaveRoom = async () => {
		if (room && user) {
			toast.promise(ticTacToeManager.leaveRoom(room.roomId, user.id), {
				loading: "Leaving room",
				success: "Left room",
				error: "Failed to leave room",
			});

			setRoom(undefined);
		}
	};

	const startGame = () => {
		if (!room) return;

		ticTacToeManager.startGame(room.roomId);
		ticTacToeManager.onGameStarted((res) => {
			setIsGameStarted(true);
			toast.success("Game started");
			setRoom(res?.room);
			setGameStatus("gameStarted");
		});
	};

	const notifyToStart = () => {
		ticTacToeManager.ready(room!.roomId);
	};

	const makeMove = (cell: number) => {
		ticTacToeManager.makeMove(room!.roomId, cell);
	};

	const resetGame = () => {};

	const isHostPlayer = () => room?.hostId === user?.id;

	// lisen on player move
	useEffect(() => {
		ticTacToeManager.onMove((res) => {
			setRoom(res?.room);
		});
	}, []);

	useEffect(() => {
		ticTacToeManager.onPlayerLeft((res) => {
			toast.info("Player left the game");
		});
	}, []);

	return {
		isCreateRoom,
		isOpponentJoined,
		isGameStarted,
		isCustomRoom,
		isJoinedRoom,
		isHostPlayer,
		gameStatus,

		createdRoomCode,
		room,
		createRoom,
		joinRoom,
		leaveRoom,
		startGame,
		notifyToStart,
		makeMove,
		resetGame,
	};
}, "TicTacToeSocket");

export const TicTacToeSocketProvider = TicTacToeSocketContext.Provider;
export const useTicTacToeSocket = TicTacToeSocketContext.use;
