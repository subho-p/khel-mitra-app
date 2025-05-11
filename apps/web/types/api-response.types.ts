export interface ApiResponse<T> {
	data?: T;
	message?: string;
}

export interface AuthApiResponse extends ApiResponse<{ accessToken: string }> {
	data?: { accessToken: string };
	message?: string;
}
