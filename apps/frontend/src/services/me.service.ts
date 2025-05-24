import { apiService } from "./api.service";
import type { IUser } from "@/types/user.type";

export const getMeService = (): Promise<{ user: IUser }> => apiService.get("/me");
