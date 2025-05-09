"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthCardWrapper } from "./AuthCardWrapper";
import { signup } from "@/actions/auth/signup.action";
import { signUpSchema, SignUpSchema } from "@khel-mitra/shared/schemas";
import { FormErrorMessage, FormSuccessMessage } from "@/components/FormMessage";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export function SignupForm() {
	const router = useRouter();
	const localStorage = useLocalStorage();

	const [isLoading, setIsLoading] = React.useState(false);
	const [success, setSuccess] = React.useState("");
	const [error, setError] = React.useState("");

	const signUpForm = useForm<SignUpSchema>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (data: SignUpSchema) => {
		setIsLoading(true);
		setSuccess("");
		setError("");

		try {
			await signup(data);
			setSuccess("User signed up successfully");
			router.push("/auth/signin");
			signUpForm.reset();
		} catch (error) {
			setError("Something went wrong");
		} finally {
			setIsLoading(false);
		}

		setTimeout(() => {
			setSuccess("");
			setError("");
		}, 5000);
	};

	return (
		<AuthCardWrapper showFooter>
			<Form {...signUpForm}>
				<form onSubmit={signUpForm.handleSubmit(onSubmit)}>
					<div className="space-y-3">
						<FormField
							control={signUpForm.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											placeholder="email@example.com"
											autoComplete="email"
											type="email"
											autoFocus
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={signUpForm.control}
							name="password"
							render={({ field }) => (
								<FormItem hidden={signUpForm.watch("email").length == 0}>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="password"
											autoComplete="off"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={signUpForm.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem
									hidden={
										signUpForm.watch("email").length == 0 ||
										signUpForm.watch("password").length == 0
									}
								>
									<FormLabel>Confirm Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="confirm password"
											autoComplete="off"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormSuccessMessage message={success} />
					<FormErrorMessage message={error} />

					<Button type="submit" className="w-full mt-3" isLoading={isLoading}>
						Sign up
					</Button>
				</form>
			</Form>
		</AuthCardWrapper>
	);
}
