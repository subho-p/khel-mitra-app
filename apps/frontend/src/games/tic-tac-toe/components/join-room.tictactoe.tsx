import { useState } from "react";
import { JoinRoom } from "@/games/components";
import { useOnlineTictactoeActions } from "@/games/tic-tac-toe/contexts";

export const JoinRoomTicTacToe = () => {
	const [joinRoomCode, setJoinRoomCode] = useState<string>("");
	const { handleJoinRoom } = useOnlineTictactoeActions();

	return (
		<JoinRoom
			joinedRoomCode={joinRoomCode}
			setJoinedRoomCode={setJoinRoomCode}
			handleJoinRoom={() => handleJoinRoom(joinRoomCode)}
		/>
	);
};
