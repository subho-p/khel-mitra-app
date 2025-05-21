import { useAuth } from "@/contexts/auth.context";
import { useRouter } from "@tanstack/react-router";

export const useSignout = () => {
	const { signOut } = useAuth();
	const router = useRouter();

	const onSignout = async () => {
		try {
			await signOut();

			const callback = router.parseLocation().pathname;
			if (callback && callback !== "/") {
				router.navigate({
					to: "/auth/signin",
					search: {
						callback,
					},
				});
			} else {
				router.navigate({
					to: "/auth/signin",
				});
			}
		} catch {
			//
		}
	};

	return { onSignout };
};
