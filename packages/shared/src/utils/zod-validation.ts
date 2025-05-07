import z from "zod";

export const zodValidation = <T extends z.ZodTypeAny>(schema: T, data: unknown): z.infer<T> => {
	if (!data) {
		throw new Error("All field is required");
	}
	const validatedData = schema.safeParse(data);

	if (!validatedData.success) {
		const errors = validatedData.error.errors.map((e) => e.message);
		throw new Error(errors[0] || "Validation failed");
	}

	return validatedData.data;
};
