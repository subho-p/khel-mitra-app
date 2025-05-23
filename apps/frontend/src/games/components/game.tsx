import { GameSettings } from "./game-settings";
import { useGameSettingsState } from "../settings/game-settings.context";
import { useRouter } from "@tanstack/react-router";
import { TicTacToeGame } from "@/games/tic-tac-toe/components";
import { useGameManager } from "./game.manager.context";

export const Game = () => {
    const router = useRouter();
    const { currentGame: game, gameFlow, onChangeGameFlow } = useGameManager();

    const { mode, onlineMode, privateRoomOption } = useGameSettingsState();

    const handleNext = () => {
        router.navigate({
            to: `/games/$game`,
            params: { game: game!.param },
            search: { mode },
        });

        if (mode === "local") {
            onChangeGameFlow("localGame");
        } else {
            if (onlineMode === "public") {
                onChangeGameFlow("randomGame");
            } else if (privateRoomOption === "create") {
                onChangeGameFlow("createRoom");
            } else if (privateRoomOption === "join") {
                onChangeGameFlow("joinRoom");
            }
        }
    };

    if (gameFlow === "idle") {
        return <GameSettings handleNext={handleNext} onReset={() => onChangeGameFlow("idle")} />;
    }

    if (game?.name === "Tic Tac Toe") {
        return <TicTacToeGame />;
    }

    if (game?.name === "Checkers") {
        return <Checkers />;
    }

    if (game?.name === "Rock Paper Scissors") {
        return <RockPaperScissors />;
    }
};

const Checkers = () => {
    return (
        <div className="flex flex-col items-center justify-center mt-16 md:mt-32 px-4">
            <p>Comming Soon</p>
        </div>
    );
};

const RockPaperScissors = () => {
    return (
        <div className="flex flex-col items-center justify-center mt-16 md:mt-32 px-4">
            <p>Comming Soon</p>
        </div>
    );
};
