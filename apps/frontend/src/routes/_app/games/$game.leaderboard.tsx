import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/games/$game/leaderboard")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_app/games/$game/leaderboard"!</div>;
}
