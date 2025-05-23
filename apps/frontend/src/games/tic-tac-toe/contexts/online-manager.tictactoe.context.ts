import { useCallback, useEffect, useState } from "react";
import { createReactContext } from "@/lib/createReactContext";

const OnlineTictactoeManagerContext = createReactContext(() => {
    const [isStarted, setIsStarted] = useState(false);
    const [isReadyToPlay, setIsReadyToPlay] = useState(false);

    const [createdRoomData, setCreatedRoomData] = useState<{
        roomId?: string;
        roomCode?: string;
        isOpponentJoined: boolean;
        isRoomCreated: boolean;
        error: string | null;
        isLoading: boolean;
        type?: "private" | "random";
    }>({
        isOpponentJoined: false,
        isRoomCreated: false,
        error: null,
        isLoading: false,
    });

    const [joinedRoomData, setJoinedRoomData] = useState<{
        roomId?: string;
        roomCode?: string;
        isRoomJoined: boolean;
        isOpponentJoined: boolean;
        error: string | null;
    }>({
        isRoomJoined: false,
        isOpponentJoined: false,
        error: null,
    });

    // Function to update the created room data
    const updateCreatedRoomData = useCallback(
        <T extends keyof typeof createdRoomData>(key: T, value: (typeof createdRoomData)[T]) => {
            setCreatedRoomData((prev) => ({
                ...prev,
                [key]: value,
            }));
        },
        []
    );

    // Function to reset the created room data
    const resetCreatedRoomData = useCallback(() => {
        setCreatedRoomData({
            roomId: undefined,
            roomCode: undefined,
            isOpponentJoined: false,
            isRoomCreated: false,
            error: null,
            isLoading: false,
        });
    }, []);

    // Function to update the joined room data
    const updateJoinedRoomData = useCallback(
        <T extends keyof typeof joinedRoomData>(key: T, value: (typeof joinedRoomData)[T]) => {
            setJoinedRoomData((prev) => ({
                ...prev,
                [key]: value,
            }));
        },
        []
    );

    // Function to reset the joined room data
    const resetJoinedRoomData = useCallback(() => {
        setJoinedRoomData({
            roomId: undefined,
            roomCode: undefined,
            isRoomJoined: false,
            isOpponentJoined: false,
            error: null,
        });
    }, []);

    // handle reset everything
    const handleOnlineTicTacToeManagerReset = useCallback(() => {
        setIsStarted(false);
        setIsReadyToPlay(false);
        resetCreatedRoomData();
        resetJoinedRoomData();
    }, [setIsStarted, setIsReadyToPlay, resetCreatedRoomData, resetJoinedRoomData]);

    // Function to clear all data
    useEffect(() => {
        return () => {
            handleOnlineTicTacToeManagerReset();
        };
    }, []);

    return {
        isStarted,
        setIsStarted,
        isReadyToPlay,
        setIsReadyToPlay,
        createdRoomData,
        updateCreatedRoomData,
        joinedRoomData,
        updateJoinedRoomData,
        resetCreatedRoomData,
        resetJoinedRoomData,
        handleOnlineTicTacToeManagerReset,
    };
}, "OnlineTictactoeManager");

export const useOnlineTictactoeManager = OnlineTictactoeManagerContext.useContext;
export const OnlineTictactoeManagerProvider = OnlineTictactoeManagerContext.Provider;
