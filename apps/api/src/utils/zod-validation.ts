import z from "zod";
import { logger } from "@khel-mitra/logger";
import { ZodValidationError } from "./error-response";

export const zodValidation = <T extends z.ZodTypeAny>(schema: T, data: unknown): z.infer<T> => {
	if (!data) {
		throw new Error("All field is required");
	}
	const validatedData = schema.safeParse(data);

	if (!validatedData.success) {
		const errors = validatedData.error.errors.map((e) => e.message);
		logger.error(validatedData.error.message, { data });
		throw new ZodValidationError(errors[0] || "Validation failed", validatedData.error.message);
	}

	return validatedData.data;
};
