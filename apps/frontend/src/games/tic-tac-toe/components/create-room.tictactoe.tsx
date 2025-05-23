import { useEffect } from "react";
import { CreateRoom } from "@/games/components";
import { useOnlineTictactoeActions, useOnlineTictactoeManager } from "@/games/tic-tac-toe/contexts";

export const CreateRoomTicTacToe = ({ onReset }: { onReset: () => void }) => {
    const { createdRoomData, resetCreatedRoomData } = useOnlineTictactoeManager();
    const { handleCreateRoom, handlePlayerLeave } = useOnlineTictactoeActions();

    function onTimeout() {
        if (createdRoomData.roomId) {
            handlePlayerLeave(createdRoomData.roomId);

            onReset();
        }
    }

    function onClose() {
        if (createdRoomData.roomId) {
            handlePlayerLeave(createdRoomData.roomId);

            onReset();
        }
    }

    useEffect(() => {
        if (!createdRoomData.isLoading && !createdRoomData.isRoomCreated) {
            handleCreateRoom();
        }
    }, [createdRoomData.isLoading, createdRoomData.isRoomCreated, handleCreateRoom]);

    useEffect(() => resetCreatedRoomData, []);

    if (createdRoomData.isLoading) {
        return (
            <div className="flex items-center justify-center my-12">
                <p>
                    Creating room
                    <span className="animate-pulse">...</span>
                </p>
            </div>
        );
    }

    if (createdRoomData.error && !createdRoomData.isRoomCreated) {
        return (
            <div className="flex items-center justify-center my-12">
                <p className="text-red-500">{createdRoomData.error}</p>
            </div>
        );
    }

    return (
        <CreateRoom roomId={createdRoomData.roomCode!} onTimeout={onTimeout} onClose={onClose} />
    );
};
