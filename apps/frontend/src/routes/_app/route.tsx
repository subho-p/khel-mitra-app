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
			<div className="flex w-full h-full pt-16 px-4">
				<Outlet />
			</div>
		</React.Fragment>
	);
}
