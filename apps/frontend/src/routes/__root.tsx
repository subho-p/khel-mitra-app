import { Header } from "@/components/navigation/header";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	return (
		<>
			<Header />
			<div className="w-full min-h-screen pt-16">
				<Outlet />
			</div>
			<TanStackRouterDevtools />
		</>
	);
}
