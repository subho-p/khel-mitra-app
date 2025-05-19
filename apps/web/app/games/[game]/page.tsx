"use client";

import TicTacToePage from "@/games/tic-tac-toe/page";
import { use } from "react";

export default function Page({ params }: { params: Promise<{ game: string }> }) {
	const game = use(params).game;


	if (game === "tic-tac-toe") return <TicTacToePage />;
}
