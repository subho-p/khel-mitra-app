"use client";

import React, { useEffect } from "react";
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
import { signInSchema, SignInSchema } from "@khel-mitra/shared/schemas";
import { FormErrorMessage, FormSuccessMessage } from "@/components/form-message";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useSession } from "@/providers/session-provider";

export function SigninForm() {
	const { signin } = useSession();
	const router = useRouter();
	const localStorage = useLocalStorage();

	const signinForm = useForm<SignInSchema>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			emailOrUsername: "",
			password: "",
		},
	});

	const onSubmit = async (data: SignInSchema) => {
		signin.mutateAsync(data).then(() => {
			setTimeout(() => {
				signinForm.reset();
				router.push("/");
                signin.reset();
			}, 2_000);
		});
	};

	useEffect(() => {
		const email = JSON.parse(localStorage.get("email"))?.email;
		if (email) {
			signinForm.setValue("emailOrUsername", email);
		}
	}, []);

	return (
		<AuthCardWrapper
			headerTitle="Sign in to your account"
			headerLink="/auth/signup"
			headerLinkText="create new account"
			showFooter
		>
			<Form {...signinForm}>
				<form onSubmit={signinForm.handleSubmit(onSubmit)}>
					<div className="space-y-3">
						<FormField
							control={signinForm.control}
							name="emailOrUsername"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email or Username</FormLabel>
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
							control={signinForm.control}
							name="password"
							render={({ field }) => (
								<FormItem>
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
					</div>

					<FormSuccessMessage message={signin.data?.message} />
					<FormErrorMessage message={signin.error?.message} />

					<Button type="submit" className="w-full mt-3" isLoading={signin.isPending}>
						Sign in
					</Button>
				</form>
			</Form>
		</AuthCardWrapper>
	);
}
