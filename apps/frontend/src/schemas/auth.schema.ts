import * as z from "zod";

export const signUpSchema = z
	.object({
		email: z.string({ required_error: "Email is required" }).email().toLowerCase().trim(),
		password: z
			.string({ required_error: "Password is required" })
			.min(6, "Password must be at least 6 characters")
			.max(20, "Password must be at most 20 characters")
			.regex(/^(?=.*[A-Z])/, {
				message: "Password must contain at least one uppercase letter",
			})
			.regex(/^(?=.*[a-z])/, {
				message: "Password must contain at least one lowercase letter",
			})
			.regex(/^(?=.*[0-9])/, { message: "Password must contain at least one number" })
			.regex(/^(?=.*[!@#$%^&*])/, {
				message: "Password must contain at least one special character",
			}),
		confirmPassword: z.string({ required_error: "Confirm password is required" }).min(8),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Confirm password don't match",
		path: ["confirmPassword"],
	});

export const signInSchema = z.object({
	emailOrUsername: z
		.string({ required_error: "Email is required" })
		.email()
		.toLowerCase()
		.trim()
		.or(
			z
				.string({ required_error: "Username is required" })
				.min(1, "Username is required")
				.regex(/^[a-zA-Z0-9]+$/, "Username must contain only letters and numbers")
		),
	password: z.string({ required_error: "Password is required" }).min(1, "Password is required"),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;
export type SignInSchema = z.infer<typeof signInSchema>;
