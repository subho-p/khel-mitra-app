import { Header } from "@/components/navigation/header";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import React from "react";

export const Route = createFileRoute("/_app")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<React.Fragment>
			<Header />
			<main className="flex w-full h-full pt-16">
				<Outlet />
			</main>
		</React.Fragment>
	);
}
