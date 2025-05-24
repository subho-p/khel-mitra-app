import { Button } from "../ui/8bit/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/8bit/card";

export const AuthCardWrapper = ({
	children,
	headerTitle,
	headerDescription,
	showGoogleLogin,
	footer,
}: {
	children: React.ReactNode;
	headerTitle: string;
	headerDescription?: string;
	showGoogleLogin?: boolean;
	footer?: React.ReactNode;
}) => {
	return (
		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle className="text-center">{headerTitle}</CardTitle>
				<CardDescription className="text-center">{headerDescription}</CardDescription>
			</CardHeader>
			<CardContent className="text-center">{children}</CardContent>
			<CardFooter className="flex flex-col gap-8">
				{showGoogleLogin && (
					<div className="flex flex-col gap-2 w-full">
						<div className="relative mx-6 text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
							<span className="relative z-10 bg-background px-2 text-muted-foreground">
								Or
							</span>
						</div>
						<Button variant="outline" className="w-full">
							Login with Google
						</Button>
					</div>
				)}

				{footer}
			</CardFooter>
		</Card>
	);
};
