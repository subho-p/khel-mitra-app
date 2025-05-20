import type { z } from "zod";
import { zodValidation } from "./zod-validation";

export const localStore = {
	get: <TSchema extends z.ZodTypeAny>(key: string, schema: TSchema): z.infer<TSchema> | null => {
		const data = localStorage.getItem(key);

		if (!data) return null;

		return zodValidation(schema, JSON.parse(data).data);
	},

	set: <TSchema extends z.ZodTypeAny>(key: string, value: z.infer<TSchema>): void => {
		const data = { data: { ...value, timestamp: Date.now() } };
		localStorage.setItem(key, JSON.stringify(data));
	},

	remove: (key: string): void => {
		localStorage.removeItem(key);
	},

	clear: (): void => {
		localStorage.clear();
	},

	keys: (): string[] => {
		return Array.from(localStorage.keys());
	},

	has: (key: string): boolean => {
		const data = localStorage.getItem(key);

		if (data) {
			return true;
		}

		if (data && !JSON.parse(data).data) {
			return false;
		}

		return false;
	},
};
