import axios from "axios";

const authApiService = axios.create({
	baseURL: "/api/auth",
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

const apiService = axios.create({
	baseURL: "/api",
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

apiService.interceptors.response.use(
	(response) => response.data.data,
	(error) => Promise.reject(error.response.data)
);

authApiService.interceptors.response.use(
	(response) => response.data.data,
	(error) => Promise.reject(error.response.data)
);

export { authApiService, apiService };
