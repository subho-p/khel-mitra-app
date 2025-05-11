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
import { AuthCardWrapper } from "./auth-card-wrapper";
import { signUpSchema, SignUpSchema } from "@khel-mitra/shared/schemas";
import { FormErrorMessage, FormSuccessMessage } from "@/components/form-message";
import { useRouter } from "next/navigation";
import { useSession } from "@/providers/session-provider";

export function SignupForm() {
	const router = useRouter();
	const { signup } = useSession();

	const signUpForm = useForm<SignUpSchema>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (data: SignUpSchema) => {
		signup.mutateAsync(data).then(() => {
			setTimeout(() => {
				signUpForm.reset();
				router.push("/");
				signup.reset();
			}, 2_000);
		});
	};

	return (
		<AuthCardWrapper
			headerTitle="Create an account"
			headerLink="/auth/signin"
			headerLinkText="Sign in to your account"
			showFooter
		>
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

					<FormSuccessMessage message={signup.data?.message} />
					<FormErrorMessage message={signup.error?.message} />

					<Button type="submit" className="w-full mt-3" isLoading={signup.isPending}>
						Sign up
					</Button>
				</form>
			</Form>
		</AuthCardWrapper>
	);
}
