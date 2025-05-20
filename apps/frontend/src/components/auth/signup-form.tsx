import { Button } from "@/components/ui/8bit/button";
import { Input } from "@/components/ui/8bit/input";
import { Label } from "@/components/ui/label";
import { type SignUpSchema, signUpSchema } from "@/schemas/auth.schema";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "../form-message";

export const SignupForm = () => {
	const signinForm = useForm<SignUpSchema>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = signinForm;

	const onSubmitSignupForm: SubmitHandler<SignUpSchema> = () => {};

	return (
		<form onSubmit={handleSubmit(onSubmitSignupForm)}>
			<div className="flex flex-col gap-6">
				<div className="grid gap-2">
					<Label htmlFor="email">Email</Label>
					<Input {...register("email")} placeholder="me@example.com" required />
					<ErrorMessage error={errors.email?.message} />
				</div>
				<div className="grid gap-2">
					<Label htmlFor="password">Password</Label>
					<Input {...register("password")} type="password" required />
					<ErrorMessage error={errors.password?.message} />
				</div>
				<div className="grid gap-2">
					<Label htmlFor="confirmPassword">Confirm Password</Label>
					<Input {...register("confirmPassword")} type="password" required />
					<ErrorMessage error={errors.confirmPassword?.message} />
				</div>
				<Button type="submit" className="w-full" disabled={isSubmitting}>
					Sign up
				</Button>
			</div>
		</form>
	);
};
