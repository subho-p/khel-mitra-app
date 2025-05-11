import apiService from "@/services/api.service";
import { ApiResponse } from "@/types/api-response.types";
import { User } from "@/types/user.types";

const getMe = async (): Promise<ApiResponse<{ user: User }>> => {
	return await apiService.get("/me");
};

export { getMe };
