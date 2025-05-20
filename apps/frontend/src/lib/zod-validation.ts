import type { z } from "zod";

export const zodValidation = <Schema extends z.ZodTypeAny>(
	schema: Schema,
	data: unknown
): z.infer<Schema> => {
	if (!data) return null;
	const validatedData = schema.safeParse(data);
	if (!validatedData.success) return null;
	return validatedData.data;
};
