import { useAuth } from "@/contexts/auth.context";
import { useAuthCallback } from "./use-auth-callback";

export const useSignout = () => {
	const { signOut } = useAuth();
	const { setAuthCallback } = useAuthCallback();

	const onSignout = async () => {
		try {
			await signOut();

			setAuthCallback();
		} catch {
			//
		}
	};

	return { onSignout };
};
