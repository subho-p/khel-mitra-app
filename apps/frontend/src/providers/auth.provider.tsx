import React from "react";
import type { IUser } from "@/types/user.type";
import { AuthContext } from "@/contexts/auth.context";
import type { SignInSchema, SignUpSchema } from "@/schemas/auth.schema";

import {
	refreshService,
	signinService,
	signoutService,
	signupService,
} from "@/services/auth.service";
import { getMeService } from "@/services/me.service";

import { localStore } from "@/lib/localstore-utils";
import { localStorageSchema } from "@/schemas/localstorage.schema";
import type { TUserStatus } from "@/types/auth.context.type";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = React.useState<IUser | null>(null);
	const [status, setStatus] = React.useState<TUserStatus>("loading");

	const getMe = React.useCallback(async () => {
		getMeService()
			.then((res) => {
				setUser(res.user);

				setStatus("authenticated");
			})
			.catch(() => {
				setStatus("unauthenticated");
			});
	}, []);

	const signIn = React.useCallback(
		async (values: SignInSchema) => {
			signinService(values)
				.then((res) => {
					localStore.set("user_status", {
						isLoggedIn: true,
						access_token: res.accessToken,
					});

					setStatus("authenticated");

					getMe();
				})
				.catch(() => {
					setStatus("unauthenticated");
				});
		},
		[getMe]
	);

	const signUp = React.useCallback(
		async (values: SignUpSchema) => {
			signupService(values)
				.then((res) => {
					localStore.set("user_status", {
						isLoggedIn: true,
						access_token: res.accessToken,
					});

					setStatus("authenticated");

					getMe();
				})
				.catch(() => {
					setStatus("unauthenticated");
				});
		},
		[getMe]
	);

	const signOut = React.useCallback(async () => {
		signoutService().then(() => {
			localStore.remove("user_status");
			setUser(null);
			setStatus("unauthenticated");
		});
	}, []);

	const refresh = React.useCallback(async () => {
		const userStatus = localStore.get("user_status", localStorageSchema.shape.userStatus);

		if (userStatus?.isLoggedIn) {
			refreshService()
				.then((res) => {
					localStore.set("user_status", {
						isLoggedIn: true,
						access_token: res.accessToken,
					});

					setStatus("authenticated");

					getMe();
				})
				.catch(() => {
					setStatus("unauthenticated");
				});
		} else {
			localStore.remove("user_status");
			setUser(null);
			setStatus("unauthenticated");
		}
	}, [getMe]);

	React.useEffect(() => {
		refresh();

		const interval = setInterval(() => {
			refresh();
		}, 15 * 60_000);

		return () => clearInterval(interval);
	}, [refresh]);

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated: status === "authenticated",
				user,
				status,
				signIn,
				signUp,
				signOut,
				refresh,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
