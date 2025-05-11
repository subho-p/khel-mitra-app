"use client";

import { createReactContext } from "./createReactContext";

import { useQuery, useQueryClient, useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { refreshToken, signup, signin, signout } from "@/services/auth.service";
import { getMe } from "@/services/me.service";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const Session = createReactContext(() => {
	const queryClient = useQueryClient();
	const [isInitialized, setIsInitialized] = useState(false);

	// refresh
	const refreshQuery = useQuery({
		queryKey: ["session"],
		queryFn: refreshToken,
		enabled: isInitialized,
		retry: 1,
        refetchInterval: 9_00_000
	});

	// me
	const meQuery = useQuery({
		queryKey: ["session", refreshQuery.isSuccess],
		queryFn: getMe,
		enabled: refreshQuery.isSuccess,
	});

	// signup
	const userSignup = useMutation({
		mutationKey: ["session", "signup"],
		mutationFn: signup,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["session"] });
		},
	});

	// signin
	const userSignin = useMutation({
		mutationKey: ["session", "signin"],
		mutationFn: signin,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["session"] });
		},
	});

	// signout
	const userSignout = useMutation({
		mutationKey: ["session", "signout"],
		mutationFn: signout,
		onSuccess: () => {
			queryClient.clear();
			queryClient.removeQueries();
			queryClient.resetQueries();

			toast("Signed out successfully", { position: "top-right" });
		},
	});

	useEffect(() => {
		const init = async () => {
			await refreshQuery.refetch();
			setIsInitialized(true);
		};

		init();
	}, []);

	const status =
		refreshQuery.isSuccess && meQuery.isSuccess
			? "authenticated"
			: refreshQuery.isSuccess && !meQuery.isSuccess
				? "unauthenticated"
				: "loading";

	const user = meQuery.data?.data?.user || null;

	return {
		// signup
		signup: userSignup,
		// signin
		signin: userSignin,
		// signout
		signout: userSignout.mutate,
		// user
		user,
		status,
	};
}, "Session");

export const useSession = Session.use;
export const SessionProvider = Session.Provider;
