import { useEffect } from "react";
import { GameLayout } from "@/games/components";
import { Button } from "@/components/ui/8bit/button";
import { useOnlineTictactoe, useOnlineTictactoeActions } from "@/games/tic-tac-toe/contexts";

export const GamePlay = () => {
	const { room, isStarted } = useOnlineTictactoe();
	const { handlePlayerMakeMove, onPlayerMakeMove } = useOnlineTictactoeActions();
	const handleMakeMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (room) {
			const target = e.target as HTMLButtonElement;
			const cellIndex = parseInt(target.dataset["cell"] || "-1", 10);
			handlePlayerMakeMove(cellIndex);
		}
	};

	useEffect(() => {
		if (isStarted) {
			onPlayerMakeMove();
		}
	}, [isStarted, onPlayerMakeMove]);

	return (
		<GameLayout className="flex-col gap-8">
			<div
				className="w-full flex flex-col gap-8 items-center justify-center"
				key="game-in-progress"
			>
				<div className="grid grid-cols-3 gap-4 w-fit" onClick={handleMakeMove}>
					{room?.board.map((cell, index) => (
						<Button
							key={index}
							data-cell={index}
							disabled={cell !== null}
							variant="secondary"
							className="size-32 text-2xl font-bold"
						>
							{cell}
						</Button>
					))}
				</div>
			</div>
		</GameLayout>
	);
};
