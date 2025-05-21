import GamesPage from "@/pages/games";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/games/")({
	component: GamesPage,
});
