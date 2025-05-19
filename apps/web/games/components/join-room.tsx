"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTicTacToeSocket } from "@/tic-tac-toe/tictictoe-socket-provider";
import { GameLayout } from "./layout";

export const JoinRoom = () => {
	const { joinRoom } = useTicTacToeSocket();
	const [joinedRoomCode, setJoinedRoomCode] = useState<string>("");

	const handleJoinRoom = () => {
		if (!joinedRoomCode) return;
		joinRoom(joinedRoomCode);
	};

	return (
		<GameLayout key="join-room" className="flex-col items-start gap-1">
			<Label htmlFor="craetedRoomCode" className="text-md font-semibold">
				Enter Room Code
			</Label>
			<div className="w-full flex flex-col md:flex-row items-center justify-center gap-3">
				<Input
					id="joinedRoomCode"
					value={joinedRoomCode}
					onChange={(e) => setJoinedRoomCode(e.target.value)}
					className="w-full"
				/>
				<Button onClick={handleJoinRoom} className="w-full md:w-auto">Join Room</Button>
			</div>
		</GameLayout>
	);
};
