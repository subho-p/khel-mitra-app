import axios from "axios";

const apiService = axios.create({
	baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

apiService.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error)
);

export default apiService;
