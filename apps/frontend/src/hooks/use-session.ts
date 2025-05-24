import { useAuth } from "@/contexts/auth.context";

export const useSession = () => {
	const { user, isAuthenticated, status } = useAuth();

	return { user, isAuthenticated, status };
};
