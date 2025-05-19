import { Button } from "@/components/ui/8bit/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
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
