"use client";

import { useGameSettings } from "@/games/game-settings.context";
import { GameSettings } from "@/games/components/game-settings";
import { CreateRoom } from "@/games/components/create-room";
import { toast } from "sonner";
import { useTicTacToeSocket } from "../tictictoe-socket-provider";
import { JoinRoom } from "@/games/components/join-room";
import { Button } from "@/components/ui/button";
import { DisplayPlayers } from "@/games/components/display-players";
import { TicTacToeBoard } from "../components";
import { GameLayout } from "@/games/components/layout";

export function TicTacToe() {
	const ticTacToeSocket = useTicTacToeSocket();
	const settings = useGameSettings();
	const { gameFlow } = settings;

	const handleBack = () => {
		settings.dispatch({ type: "RESET" });
		settings.onChangeGameFlow("idle");
	};

	const handleNext = async () => {
		if (settings.mode === "offline") {
			settings.onChangeGameFlow("local");
			// create local game
		} else if (settings.onlineMode === "random") {
			settings.onChangeGameFlow("random-online");
			//* socket emit for random room
		} else if (settings.isAdmin === true) {
			settings.onChangeGameFlow("create-room");
			ticTacToeSocket.createRoom();
		} else if (settings.isAdmin === false) {
			settings.onChangeGameFlow("join-room");
			//* socket emit for join room
		} else {
			toast.warning("Select valid options");
		}
	};

	const onCreateRoomTimeout = () => {
		toast.warning("Your room code has expired");
		settings.onChangeGameFlow("idle");
		settings.dispatch({ type: "RESET" });
		ticTacToeSocket.leaveRoom();
	};

	const onCloseCreateRoom = () => {
		toast.warning("You have cancelled the room");
		settings.onChangeGameFlow("idle");
		settings.dispatch({ type: "RESET" });
		ticTacToeSocket.leaveRoom();
	};

	if (ticTacToeSocket.gameStatus === "gameStarted") {
		const room = ticTacToeSocket.room;
		if (!room) return null;
		return (
			<GameLayout key="tic-tac-toe-game-started">
				<TicTacToeBoard board={room.board} handleClick={ticTacToeSocket.makeMove} />
			</GameLayout>
		);
	}

	if (ticTacToeSocket.gameStatus === "opponentJoinedRoom") {
		// start game
		return (
			<GameLayout key="tic-tac-toe-opponent-joined" className="flex-col">
				<DisplayPlayers players={ticTacToeSocket.room?.players || []} />

				{ticTacToeSocket.isHostPlayer() ? (
					<Button onClick={ticTacToeSocket.startGame}>Start Game</Button>
				) : (
					<Button onClick={ticTacToeSocket.notifyToStart}>Notify to start</Button>
				)}
			</GameLayout>
		);
	}

	if (gameFlow === "local") {
		return (
			<div className="flex flex-col w-full max-w-xl gap-6 items-center justify-between">
				<h3 className="text-xl font-bold">Local Game</h3>
			</div>
		);
	}

	if (gameFlow === "random-online") {
		return (
			<div className="flex flex-col w-full max-w-xl gap-6 items-center justify-between">
				<h3 className="text-xl font-bold">Random Room</h3>
			</div>
		);
	}

	if (gameFlow === "create-room") {
		return (
			<CreateRoom
				roomId={ticTacToeSocket.room?.roomCode || ""}
				onTimeout={onCreateRoomTimeout}
				onClose={onCloseCreateRoom}
			/>
		);
	}

	if (gameFlow === "join-room") {
		return <JoinRoom />;
	}

	return <GameSettings handleBack={handleBack} handleNext={handleNext} />;
}
