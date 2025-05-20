import type { SignInSchema, SignUpSchema } from "@/schemas/auth.schema";
import type { IUser } from "./user.type";

export type TUserStatus = "loading" | "authenticated" | "unauthenticated";

export interface IAuthContextState {
	isAuthenticated: boolean;
	user: IUser | null;
	status: TUserStatus;
}

export interface IAuthContextActions {
	signIn: (values: SignInSchema) => Promise<void>;
	signUp: (values: SignUpSchema) => Promise<void>;
	signOut: () => Promise<void>;
	refresh: () => Promise<void>;
}

export interface IAuthContext extends IAuthContextState, IAuthContextActions {}