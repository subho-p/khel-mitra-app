import type { SignInSchema, SignUpSchema } from "@/schemas/auth.schema";
import { authApiService as authService } from "./api.service";

interface AuthApiResponse {
	accessToken: string;
}

export const signupService = async (values: SignUpSchema): Promise<AuthApiResponse> => {
	return await authService.post("/sign-up", values);
};

export const signinService = async (values: SignInSchema): Promise<AuthApiResponse> => {
	return await authService.post("/sign-in", values);
};

export const signoutService = async (): Promise<void> => {
	return await authService.post("/sign-out");
};

export const refreshService = async (): Promise<AuthApiResponse> => {
	return await authService.post("/refresh-token");
};
