import { GameLayout } from "@/games/components";
import { Button } from "@/components/ui/button";
import { DisplayPlayers } from "@/games/tic-tac-toe/components";
import { useOnlineTictactoe, useOnlineTictactoeActions } from "@/games/tic-tac-toe/contexts";

export const ReadyToPlayerDisplay = () => {
	const { room, isHost } = useOnlineTictactoe();
	const { handleStartPrivateGame } = useOnlineTictactoeActions();
console.log("Is ready", room);
	return (
		<GameLayout className="flex-col gap-8">
			<div
				className="w-full flex flex-col gap-8 items-center justify-center"
				key="ready-to-play"
			>
				<p>Ready to Play</p>
				<DisplayPlayers players={room!.players} />
				{room?.isPrivate ? (
					<div>
						{isHost() ? (
							<Button onClick={handleStartPrivateGame}>Start Game</Button>
						) : (
							<p>Waiting for Host to Start Game</p>
						)}
					</div>
				) : (
					<p>Waiting for Opponent</p>
				)}
			</div>
		</GameLayout>
	);
};
