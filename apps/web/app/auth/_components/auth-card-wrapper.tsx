import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui/card";
import Link from "next/link";

export const AuthCardWrapper = ({
	children,
	headerTitle,
	headerLink,
	headerLinkText,
	showFooter = true,
}: {
	children: React.ReactNode;
	headerTitle: string;
	headerLink?: string;
	headerLinkText?: string;
	showFooter: boolean;
}) => {
	return (
		<Card>
			<CardHeader className="text-center">
				<CardTitle className="text-xl">{headerTitle}</CardTitle>
				<div className="flex items-center justify-center text-sm pb-4 pt-1">
					<span className="font-semibold text-muted-foreground">Or </span>
					{headerLink && (
						<Link href={headerLink} className="text-primary ml-0.5 hover:underline">
							{headerLinkText}
						</Link>
					)}
				</div>
			</CardHeader>
			<CardContent>{children}</CardContent>
			<div className="relative mx-6 text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
				<span className="relative z-10 bg-background px-2 text-muted-foreground">Or</span>
			</div>
			<CardFooter className="flex flex-col gap-4" hidden={!showFooter}>
				<Button variant="outline" className="w-full">
					Continue with Google
				</Button>
				<div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary pt-2">
					By clicking continue, you agree to our <Link href="#">Terms of Service</Link>{" "}
					and <Link href="#">Privacy Policy</Link>.
				</div>
			</CardFooter>
		</Card>
	);
};
