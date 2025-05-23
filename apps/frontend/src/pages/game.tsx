import { Game } from "@/games/components/game";
import { GameManagerProvider, useGameManager } from "@/games/components/game.manager.context";
import { GameSettingsProvider } from "@/games/settings/game-settings.provider";
import React from "react";

const GamePageWrapper = () => {
    return (
        <div className="w-full py-8 px-4 min-h-screen flex flex-col">
            <GameSettingsProvider>
                <GameManagerProvider>
                    <GamePage />
                </GameManagerProvider>
            </GameSettingsProvider>
        </div>
    );
};

function GamePage() {
    const { currentGame } = useGameManager();

    if (!currentGame) {
        return <div>Game not found</div>;
    }

    return (
        <React.Fragment>
            <h1 className="text-2xl text-center tracking-tighter ">{currentGame?.name}</h1>
            <Game key={currentGame.param} />
        </React.Fragment>
    );
}

export default GamePageWrapper;
