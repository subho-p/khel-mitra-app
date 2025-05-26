import { Button } from "@/components/ui/button";
import { GameLayout } from "@/games/components";
import type { GameEndStutus } from "@/types";
import { useOnlineTictactoeActions } from "../contexts";
import { ReadyToPlayerDisplay } from "./ready-to-player-display";

export const GameResult = ({
	gameEndState,
}: {
	gameEndState: {
		status: GameEndStutus | null;
		message: string | null;
		isReady: boolean;
	};
}) => {
	const { handleRestartGame } = useOnlineTictactoeActions();

	if (gameEndState.isReady) return <ReadyToPlayerDisplay />;

	return (
		<GameLayout>
			<div className="flex flex-col items-center gap-4" key="game-result">
				<div>
					{gameEndState.status === "win" && (
						<p className="text-emerald-600">{gameEndState.message}</p>
					)}
					{gameEndState.status === "lose" && (
						<p className="text-destructive">{gameEndState.message}</p>
					)}
					{gameEndState.status === "draw" && <p>{gameEndState.message}</p>}
				</div>

				<div>
					<Button onClick={handleRestartGame}>Play Again</Button>
				</div>
			</div>
		</GameLayout>
	);
};
