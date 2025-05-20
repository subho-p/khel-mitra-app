import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/8bit/button";

export const Route = createFileRoute("/_app/")({
	component: Index,
});

function Index() {
	return (
		<div className="">
			<h1>Welcome to Khel Mitra</h1>

			<Button>Button</Button>
		</div>
	);
}
