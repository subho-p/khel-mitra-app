import { useCallback, useEffect } from "react";
import { createReactContext } from "@/lib/createReactContext";
import type { SocketResponse, TicTacToeRoom } from "@/types";

import { useAuth } from "@/contexts/auth.context";
import { handleSocketResponse } from "@/socket/socket.utils";

import { useOnlineTictactoe, useOnlineTictactoeManager } from "@/games/tic-tac-toe/contexts";
import { ticTacToeSocketManager } from "@/games/tic-tac-toe/tic-tac-toe-socket.manager";
import { useGameManager } from "@/games/components/game.manager.context";
import { useGameSettingsActions } from "@/games/settings/game-settings.context";
import { toast } from "@/components/ui/8bit/toast";

const OnlineTictactoeActionsContext = createReactContext(() => {
    const { reset: resetGameSettings } = useGameSettingsActions();
    const { handleReset: handleGameManagerReset } = useGameManager();
    const { setIsReadyToPlay, setRoom, room, setIsStarted, handleOnlineTictactoeStoreReset } =
        useOnlineTictactoe();
    const {
        createdRoomData,
        updateCreatedRoomData,
        resetCreatedRoomData,
        handleOnlineTicTacToeManagerReset,
    } = useOnlineTictactoeManager();
    const { user } = useAuth();

    const handleRoomReadyToPlay = useCallback(
        (flag: boolean, room: TicTacToeRoom) => {
            setIsReadyToPlay(flag, room);
            setRoom(room);

            ticTacToeSocketManager.onGameStarted((res: SocketResponse) => {
                handleSocketResponse(res, {
                    onSuccess: (data) => {
                        setIsStarted(true, data.room);
                    },
                    onError: (message) => {
                        console.error("Error starting game", message);
                    },
                });
            });
        },
        [setIsReadyToPlay, setRoom, setIsStarted]
    );

    const onOpponentJoined = useCallback(() => {
        ticTacToeSocketManager.onOpponentJoined((res: SocketResponse<{ room: TicTacToeRoom }>) => {
            handleSocketResponse(res, {
                onSuccess: (data) => {
                    updateCreatedRoomData("roomId", data.room.roomId);
                    updateCreatedRoomData("roomCode", data.room.roomCode);
                    updateCreatedRoomData("isOpponentJoined", true);

                    if (createdRoomData.type === "private") {
                        setTimeout(() => {
                            updateCreatedRoomData("isLoading", false);
                        }, 1_000);
                    }

                    handleRoomReadyToPlay(true, data.room);
                },
                onError: (message) => {
                    updateCreatedRoomData("error", message);
                    console.error("Error joining room", message);
                },
            });
        });
    }, [updateCreatedRoomData, handleRoomReadyToPlay, createdRoomData.type]);

    // handle creating a room
    const handleCreateRoom = useCallback(() => {
        updateCreatedRoomData("isLoading", true);
        updateCreatedRoomData("type", "private");
        ticTacToeSocketManager.createPrivateRoom((res: SocketResponse<{ room: TicTacToeRoom }>) => {
            handleSocketResponse(res, {
                onSuccess: (data) => {
                    updateCreatedRoomData("roomId", data.room.roomId);
                    updateCreatedRoomData("roomCode", data.room.roomCode);
                    updateCreatedRoomData("isRoomCreated", true);
                    onOpponentJoined();

                    setTimeout(() => {
                        updateCreatedRoomData("isLoading", false);
                    }, 1_000);
                },
                onError: (message) => {
                    updateCreatedRoomData("error", message);
                    console.error("Error creating room", message);
                    updateCreatedRoomData("isLoading", false);
                },
            });
        });
    }, [updateCreatedRoomData, onOpponentJoined]);

    const handlePlayerLeave = useCallback(
        (roomId: string) => {
            ticTacToeSocketManager.leaveRoom(roomId, user!.id, (res: SocketResponse) => {
                handleSocketResponse(res, {
                    onSuccess: () => {
                        resetCreatedRoomData();
                    },
                    onError: (message) => {
                        updateCreatedRoomData("error", message);
                    },
                });
            });
        },
        [resetCreatedRoomData, updateCreatedRoomData, user]
    );

    const handleJoinRoom = useCallback(
        (joinRoomCode: string) => {
            if (!joinRoomCode) {
                return;
            }

            ticTacToeSocketManager.joinRoom(joinRoomCode, (res: SocketResponse) => {
                handleSocketResponse(res, {
                    onSuccess: (data) => {
                        handleRoomReadyToPlay(true, data.room);
                    },
                    onError: (message) => {
                        console.error(message);
                    },
                });
            });
        },
        [handleRoomReadyToPlay]
    );

    const handlePlayerMakeMove = useCallback(
        (cellIndex: number) => {
            if (room) {
                ticTacToeSocketManager.move(cellIndex, room.roomId);
            }
        },
        [room]
    );

    const onPlayerMakeMove = useCallback(() => {
        ticTacToeSocketManager.onMoveMade((res: SocketResponse) => {
            handleSocketResponse(res, {
                onSuccess: (data) => {
                    setRoom(data.room);
                },
                onError: (message) => {
                    console.error("Error making move", message);
                },
            });
        });
    }, [setRoom]);

    const handleStartPrivateGame = useCallback(() => {
        if (room && room.isPrivate) {
            ticTacToeSocketManager.startGame(room.roomId);
        }
    }, [room]);

    const handleStartRandomGame = useCallback(() => {
        updateCreatedRoomData("isLoading", true);
        updateCreatedRoomData("type", "random");
        ticTacToeSocketManager.joinRandomRoom((res: SocketResponse) => {
            handleSocketResponse(res, {
                onSuccess: (data) => {
                    updateCreatedRoomData("roomId", data.room.roomId);
                    updateCreatedRoomData("roomCode", data.room.roomCode);
                    updateCreatedRoomData("isRoomCreated", true);

                    onOpponentJoined();
                },
                onError: (message) => {
                    console.error("Error joining random room", message);
                    updateCreatedRoomData("error", message);
                    updateCreatedRoomData("isLoading", false);
                },
            });
        });
    }, [onOpponentJoined, updateCreatedRoomData]);

    // Call the function to listen for player left events
    useEffect(() => {
        function onPlayerLeft() {
            ticTacToeSocketManager.onPlayerLeft((res) => {
                // clear the room data
                console.log("Player left", res);
                resetCreatedRoomData();
                handleGameManagerReset();
                handleOnlineTicTacToeManagerReset();
                handleOnlineTictactoeStoreReset();
                resetGameSettings();

                toast("Player left the game");
            });
        }

        function onGameEnded() {
            ticTacToeSocketManager.onGameEnded(
                (
                    res: SocketResponse<{
                        room: TicTacToeRoom;
                        status: string;
                    }>
                ) => {
                    handleSocketResponse(res, {
                        onSuccess: (data) => {
                            console.log("Game ended", data);

                            setRoom(data.room);
                            if (data.status === "draw") {
                                toast("Game has been drawn");
                            }
                            if (data.status === "win") {
                                toast("Game has been won");
                            }
                        },
                        onError: (message) => {
                            console.error("Error ending game", message);
                        },
                    });
                }
            );
        }

        onPlayerLeft();
        onGameEnded();
    }, []);

    // Call the function to listen for player left events
    useEffect(() => {
        return () => {
            ticTacToeSocketManager.playerLeft();
            ticTacToeSocketManager.offAllEvents();
        };
    }, []);

    return {
        handleCreateRoom,
        handleRoomReadyToPlay,
        onOpponentJoined,
        handleJoinRoom,
        handlePlayerLeave,
        handlePlayerMakeMove,
        onPlayerMakeMove,
        handleStartPrivateGame,
        handleStartRandomGame,
    };
}, "Online Tictactoe Actions");

export const OnlineTictactoeActionsProvider = OnlineTictactoeActionsContext.Provider;
export const useOnlineTictactoeActions = OnlineTictactoeActionsContext.useContext;
