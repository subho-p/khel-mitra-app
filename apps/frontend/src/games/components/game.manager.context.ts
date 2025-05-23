import { createReactContext } from "@/lib/createReactContext";
import type { GameFlow } from "@/types/player.type";
import { useRouter } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { useGameSettingsActions } from "../settings/game-settings.context";
import { Games } from "@/constants/game.constant";

const GameManagerContext = createReactContext(() => {
    const router = useRouter();
    const { reset } = useGameSettingsActions();
    
    const [gameFlow, setGameFlow] = useState<GameFlow>("idle");

    const currentGame = useMemo(() => {
        const game = router.latestLocation.pathname.split("/").pop();
        return Games.find((g) => g.param === game);
    }, [router.latestLocation.pathname]);


    const onChangeGameFlow = useCallback((flow: GameFlow) => {
        setGameFlow(flow);
    }, []);

    const handleReset = useCallback(() => {
        if (currentGame) {
            setGameFlow("idle");
            router.navigate({
                to: `/games/$game`,
                params: { game: currentGame.param },
            });

            reset();
        }
    }, [currentGame, reset, router]);

    return { currentGame, gameFlow, onChangeGameFlow, handleReset };
}, "Game Manager");

export const GameManagerProvider = GameManagerContext.Provider;
export const useGameManager = GameManagerContext.useContext;
