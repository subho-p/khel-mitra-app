"use client";

import { TicTacToeSocketProvider } from "../tictictoe-socket-provider";
import { TicTacToe } from "./tic-tac-toe";

export default function TicTacToePage() {
	return (
		<TicTacToeSocketProvider>
			<TicTacToe />
		</TicTacToeSocketProvider>
	);
}
