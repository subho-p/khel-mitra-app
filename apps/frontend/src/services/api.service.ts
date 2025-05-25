import { isDev } from "@/constants";
import axios from "axios";

const API_BASE_URL = isDev ? "/api" : import.meta.env.VITE_API_URL + "/api";

const authApiService = axios.create({
	baseURL: API_BASE_URL + "/auth",
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

const apiService = axios.create({
	baseURL: API_BASE_URL,
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
