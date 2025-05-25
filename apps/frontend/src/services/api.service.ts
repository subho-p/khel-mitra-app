import { isDev } from "@/constants";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const authApiService = axios.create({
	baseURL: isDev ? "/api/auth" : `${BASE_URL}/api/auth`,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

const apiService = axios.create({
	baseURL: isDev ? "/api" : `${BASE_URL}/api`,
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
