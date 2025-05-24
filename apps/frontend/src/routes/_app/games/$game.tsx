import GamePage from "@/pages/game";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/games/$game")({
	beforeLoad(ctx) {
		const search = ctx.location.search;
		const params = new URLSearchParams(search);
		if (params.get("mode") === "online" && !ctx.context.auth.isAuthenticated) {
			ctx.navigate({ to: "/auth/signin" });
		}
	},
	component: GamePage,
});
