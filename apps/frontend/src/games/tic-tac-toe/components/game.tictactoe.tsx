import { useGameManager } from "@/games/components/game.manager.context";

import {
	CreateRoomTicTacToe,
	JoinRoomTicTacToe,
	ReadyToPlayerDisplay,
	GamePlay,
	LocalTicTacToeGame,
	RandomRoomTicTacToe,
} from "@/games/tic-tac-toe/components";
import {
	OnlineTictactoeActionsProvider,
	useOnlineTictactoe,
	OnlineTictactoeProvider,
	OnlineTictactoeManagerProvider,
} from "@/games/tic-tac-toe/contexts";

const TicTacToeGame = () => {
	const { gameFlow, handleReset } = useGameManager();
	const { isReadyToPlay, room, isStarted } = useOnlineTictactoe();

	if (isStarted) return <GamePlay />;

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
