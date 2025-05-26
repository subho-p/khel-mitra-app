import { useRouter } from "@tanstack/react-router";

export const useAuthCallback = () => {
	const router = useRouter();

	const setAuthCallback = (push = "/auth/signin", search?: { callback?: string }) => {
		const callback = search?.callback || router.parseLocation().href;

		if (callback) {
			router.navigate({
				to: push,
				search: { callback },
			});
		}
	};

	const onAuthDone = (defaultCallback = "/") => {
		const callback = (router.parseLocation().search as any)?.callback;
		if (callback) {
			router.navigate({
				to: callback,
			});
		} else {
			router.navigate({
				to: defaultCallback,
			});
		}
	};

	return { setAuthCallback, onAuthDone };
};
