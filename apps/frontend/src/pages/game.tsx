import { Games } from "@/constants/game.constant";
import { Game } from "@/games/components/game";
import { GameSettingsProvider } from "@/games/settings/game-settings.provider";
import { useRouter } from "@tanstack/react-router";

export default function GamePage() {
    const router = useRouter();

    const currentGame = Games.find((game) => game.link === router.latestLocation.pathname);

    if (!currentGame) {
        return <div>Game not found</div>;
    }

    return (
        <div className="w-full py-8 px-4 min-h-screen flex flex-col">
            <GameSettingsProvider>
                <h1 className="text-2xl text-center tracking-tighter ">{currentGame?.name}</h1>
                <Game game={currentGame} />
            </GameSettingsProvider>
        </div>
    );
}
