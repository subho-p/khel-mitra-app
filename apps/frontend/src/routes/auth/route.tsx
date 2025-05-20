import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Gamepad2 } from "lucide-react";

const authRoutes = ["/auth/signin", "/auth/signup"];

export const Route = createFileRoute("/auth")({
	beforeLoad(ctx) {
		console.log(ctx.context.auth);
		if (authRoutes.includes(ctx.location.pathname) && ctx.context.auth.isAuthenticated) {
			ctx.navigate({ to: "/", replace: true });
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="w-full min-h-[100svh] flex flex-col items-center justify-center gap-8">
			<Gamepad2 className="size-16 text-primary" />
			<h1 className="text-2xl font-bold md:text-3xl">Khel Mitra</h1>
			<Outlet />
		</div>
	);
}
