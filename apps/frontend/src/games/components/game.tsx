import { useState } from "react";
import { GameSettings } from "./game-settings";
import type { Games } from "@/constants/game.constant";
import { useGameSettingsState } from "../settings/game-settings.context";
import { useRouter } from "@tanstack/react-router";
import { TicTacToeGame } from "@/games/tic-tac-toe/components";

export type GameFlow = "idle" | "localGame" | "randomGame" | "createRoom" | "joinRoom";

export const Game = ({ game }: { game: (typeof Games)[number] }) => {
    const router = useRouter();
    const [gameFlow, setGameFlow] = useState<GameFlow>("idle");

    const { mode, onlineMode, privateRoomOption } = useGameSettingsState();

    const handleNext = () => {
        router.navigate({
            to: `/games/$game`,
            params: { game: game.param },
            search: { mode },
        });

        if (mode === "local") {
            setGameFlow("localGame");
        } else {
            if (onlineMode === "public") {
                setGameFlow("randomGame");
            } else if (privateRoomOption === "create") {
                setGameFlow("createRoom");
            } else if (privateRoomOption === "join") {
                setGameFlow("joinRoom");
            }
        }
    };

    if (gameFlow === "idle") {
        return <GameSettings handleNext={handleNext} onReset={() => setGameFlow("idle")} />;
    }

    if (game.name === "Tic Tac Toe") {
        return <TicTacToeGame gameFlow={gameFlow} />;
    }

    if (game.name === "Checkers") {
        return <Checkers />;
    }

    if (game.name === "Rock Paper Scissors") {
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
