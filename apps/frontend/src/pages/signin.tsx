import { AuthCardWrapper } from "@/components/auth/auth-card-wrapper";
import { SigninForm } from "@/components/auth/signin-form";
import { Link } from "@tanstack/react-router";

export const SigninPage = () => {
	return (
		<AuthCardWrapper
			key="signin-form"
			headerTitle="Signin"
			headerDescription="Signin to your account"
			showGoogleLogin
			footer={
				<div className="text-center text-xs">
					<p>Don&apos;t have an account? </p>
					<Link to="/auth/signup" className="text-primary hover:underline">
						Sign up
					</Link>
				</div>
			}
		>
			<SigninForm />
		</AuthCardWrapper>
	);
};
