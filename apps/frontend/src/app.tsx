import { RouterProvider, createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { useAuth } from "./contexts/auth.context";
import { AuthProvider } from "./providers/auth.provider";

// Create a new router instance
const router = createRouter({
	routeTree,
	context: {
		auth: undefined!,
	},
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const InnerApp = () => {
	const auth = useAuth();

	// TODO: Add a loading screen
	if (auth.status === "loading") {
		return <div>Loading...</div>;
	}

	return <RouterProvider router={router} context={{ auth }} />;
};

const App = () => {
	return (
		<AuthProvider>
			<InnerApp />
		</AuthProvider>
	);
};

export default App;