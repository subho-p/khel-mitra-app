import { z } from "zod";

const userStatusSchema = z
	.object({
		isLoggedIn: z.boolean(),
		access_token: z.string(),
		timestamp: z.number(),
	})
	.transform((data) => ({
		...data,
		// TODO: check if token is expired - 7 days
		isProbablyExpired: Date.now() - data.timestamp > 7 * 24 * 60 * 60 * 1000,
	}));

export const localStorageSchema = z.object({ userStatus: userStatusSchema });

export type LocalStorageSchema = z.infer<typeof localStorageSchema>;