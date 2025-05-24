import { Button } from "@/components/ui/8bit/button";
import { Input } from "@/components/ui/8bit/input";
import { Label } from "@/components/ui/label";
import { type SignInSchema, signInSchema } from "@/schemas/auth.schema";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage, SuccessMessage } from "../form-message";
import { useAuth } from "@/contexts/auth.context";
import React from "react";

export const SigninForm = () => {
	const [isLoading, setIsLoading] = React.useState(false);
	const [errorMessage, setErrorMessage] = React.useState<string>();
	const [successMessage, setSuccessMessage] = React.useState<string>();

	const { signIn } = useAuth();

	const signinForm = useForm<SignInSchema>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			emailOrUsername: "",
			password: "",
		},
	});

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = signinForm;

	const onSubmitSigninForm: SubmitHandler<SignInSchema> = async (values: SignInSchema) => {
		setIsLoading(true);
		setErrorMessage(undefined);
		setSuccessMessage(undefined);

		await signIn(values)
			.then(() => {
				setSuccessMessage("Signed in successfully");
			})
			.catch(() => {
				setErrorMessage("Signin failed");
			})
			.finally(() => setIsLoading(false));
	};

	return (
		<form onSubmit={handleSubmit(onSubmitSigninForm)}>
			<div className="flex flex-col gap-6">
				<div className="grid gap-2">
					<Label htmlFor="email">Email</Label>
					<Input {...register("emailOrUsername")} placeholder="me@example.com" required />
					<ErrorMessage error={errors.emailOrUsername?.message} />
				</div>
				<div className="grid gap-2">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
						<Label htmlFor="password">Password</Label>
						<a
							href="#"
							className="inline-block text-xs underline-offset-4 hover:underline"
						>
							Forgot password?
						</a>
					</div>
					<Input {...register("password")} type="password" required />
					<ErrorMessage error={errors.password?.message} />
				</div>

				<ErrorMessage error={errors.root?.message || errorMessage} />
				<SuccessMessage message={successMessage} />
				<Button type="submit" className="w-full" disabled={isSubmitting || isLoading}>
					{isSubmitting || isLoading ? "Signing in..." : "Sign in"}
				</Button>
			</div>
		</form>
	);
};
