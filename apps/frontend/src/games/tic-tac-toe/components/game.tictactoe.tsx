import { Chat } from "@/components/chat";
import { useGameManager } from "@/games/components/game.manager.context";

import {
	CreateRoomTicTacToe,
	JoinRoomTicTacToe,
	ReadyToPlayerDisplay,
	GamePlay,
	LocalTicTacToeGame,
	RandomRoomTicTacToe,
	GameResult,
} from "@/games/tic-tac-toe/components";
import {
	OnlineTictactoeActionsProvider,
	useOnlineTictactoe,
	OnlineTictactoeProvider,
	OnlineTictactoeManagerProvider,
} from "@/games/tic-tac-toe/contexts";

const TicTacToeGame = () => {
	const { gameFlow, handleReset } = useGameManager();
	const { isReadyToPlay, room, isStarted, gameEndState } = useOnlineTictactoe();
	console.log("Game end state", gameEndState);
	if (gameEndState.status) {
		return <GameResult gameEndState={gameEndState} />;
	}

	if (isStarted) {
		return (
			<>
				<GamePlay />
				<Chat roomId={room?.roomId} />
			</>
		);
	}

	if (gameEndState.isReady || room?.status === "waiting") return <ReadyToPlayerDisplay />;

	if (isReadyToPlay && room) return <ReadyToPlayerDisplay />;

	switch (gameFlow) {
		case "localGame":
			return <LocalTicTacToeGame />;
		case "randomGame":
			return <RandomRoomTicTacToe />;
		case "createRoom":
			return <CreateRoomTicTacToe onReset={handleReset} />;
		case "joinRoom":
			return <JoinRoomTicTacToe />;
		default:
			return (
				<div className="flex flex-col items-center justify-center mt-16 md:mt-32 px-4">
					<p>Coming Soon</p>
				</div>
			);
	}
};

const TicTacToeGameWrapper = () => {
	return (
		<OnlineTictactoeManagerProvider>
			<OnlineTictactoeProvider>
				<OnlineTictactoeActionsProvider>
					<TicTacToeGame />
				</OnlineTictactoeActionsProvider>
			</OnlineTictactoeProvider>
		</OnlineTictactoeManagerProvider>
	);
};

export { TicTacToeGameWrapper as TicTacToeGame };
