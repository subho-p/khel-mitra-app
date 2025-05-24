import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/_auth")({
	beforeLoad(ctx) {
		if (!ctx.context.auth.isAuthenticated) {
			ctx.navigate({ to: "/auth/signin" });
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	return <Outlet />;
}
