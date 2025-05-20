import { AuthCardWrapper } from "@/components/auth/auth-card-wrapper";
import { SignupForm } from "@/components/auth/signup-form";
import { Link } from "@tanstack/react-router";

export const SignupPage = () => {
	return (
		<AuthCardWrapper
			key="signin-form"
			headerTitle="Signup"
			headerDescription="Create new account"
			showGoogleLogin
			footer={
				<div className="text-center text-xs">
					<p>Already have an account?</p>
					<Link to="/auth/signin" className="text-primary hover:underline">
						Sign in
					</Link>
				</div>
			}
		>
			<SignupForm />
		</AuthCardWrapper>
	);
};
