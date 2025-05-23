import { useEffect } from "react";
import { useOnlineTictactoeActions, useOnlineTictactoeManager } from "../contexts";

export const RandomRoomTicTacToe = () => {
    const { createdRoomData } = useOnlineTictactoeManager();
    const { handleStartRandomGame } = useOnlineTictactoeActions();

    useEffect(() => {
        handleStartRandomGame();
    }, []);

    if (createdRoomData.isLoading) {
        return (
            <div className="flex flex-col items-center justify-center mt-16 md:mt-32 px-4">
                <p>Finding Random Room...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center mt-16 md:mt-32 px-4">
            <p>Random Room</p>
        </div>
    );
};
