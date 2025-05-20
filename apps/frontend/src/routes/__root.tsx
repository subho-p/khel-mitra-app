import type { IAuthContext } from "@/types/auth.context.type";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

interface RouterContext {
	auth: IAuthContext;
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootComponent,
});

function RootComponent() {
	return (
		<>
			<div className="w-full min-h-screen mx-auto">
				<Outlet />
			</div>
			<TanStackRouterDevtools />
		</>
	);
}
