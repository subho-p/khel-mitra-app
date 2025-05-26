import GamePage from "@/pages/game";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/games/$game")({
	beforeLoad(ctx) {
		const search = ctx.location.search;
		const params = new URLSearchParams(search);
        const callback = ctx.location.href;
		if (params.get("mode") === "online" && !ctx.context.auth.isAuthenticated) {
			ctx.navigate({ to: "/auth/signin", search: { callback } });
		}
	},
	component: GamePage,
});
