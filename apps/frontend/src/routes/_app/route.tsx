import { Header } from "@/components/navigation/header";
import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";

export const Route = createFileRoute("/_app")({
	component: RouteComponent,
});

function RouteComponent() {
	const router = useRouter();

	useEffect(() => {
		const search = router.state.location.search as any;
		if (search) {
			// game & roomCode
			if (search?.game && search?.roomCode) {
				router.navigate({
					to: `/games/$game`,
					params: { game: search.game },
					search: { mode: "online", roomCode: search.roomCode },
				});
			}
		}
	}, [router]);

	return (
		<React.Fragment>
			<Header />
			<main className="flex w-full h-full pt-16">
				<Outlet />
			</main>
		</React.Fragment>
	);
}
