import { ApiResponse, AuthApiResponse } from "@/types/api-response.types";
import { SignInSchema, SignUpSchema } from "@khel-mitra/shared/schemas";
import axios from "axios";

const authService = axios.create({
	baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/auth`,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

authService.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error)
);

const signup = async (values: SignUpSchema): Promise<AuthApiResponse> => {
	return await authService.post("/sign-up", values);
};

const signin = async (values: SignInSchema): Promise<AuthApiResponse> => {
	return await authService.post("/sign-in", values);
};

const signout = async (): Promise<ApiResponse<void>> => {
	return await authService.post("/sign-out");
};

const refreshToken = async (): Promise<AuthApiResponse> => {
	return await authService.post("/refresh-token");
};

export { signup, signin, signout, refreshToken };
