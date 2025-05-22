import React from "react";
import type { GameSettings, GameSettingsActions } from "@/types/game-settings.type";

export const GameSettingsContext = React.createContext<GameSettings | undefined>(undefined);
export const GameSettingsActionsContext = React.createContext<GameSettingsActions | undefined>(undefined);

export const useGameSettingsState = () => {
    const context = React.useContext(GameSettingsContext);
    if (context === undefined) {
        throw new Error("useGameSettings must be used within a GameSettingsProvider.");
    }
    return context;
};

export const useGameSettingsActions = () => {
    const context = React.useContext(GameSettingsActionsContext);
    if (context === undefined) {
        throw new Error("useGameSettingsActions must be used within a GameSettingsProvider.");
    }
    return context;
};

export const useGameSettings = () => {
    const state = useGameSettingsState();
    const actions = useGameSettingsActions();
    return { state, actions };
};