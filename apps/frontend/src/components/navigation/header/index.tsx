import { Button } from "@/components/ui/8bit/button";
import { Separator } from "@/components/ui/8bit/separator";
import { Link, useNavigate } from "@tanstack/react-router";

const navLinks = [
	{
		name: "Home",
		link: "/",
	},
	{
		name: "Games",
		link: "/games",
	},
	{
		name: "Community",
		link: "/community",
	},
] as const;

export const Header = () => {
	const navigate = useNavigate();

	return (
		<header className="flex w-full h-16 border-b border-border z-50 fixed top-0 bg-background/50 backdrop-blur-2xl mx-auto items-center justify-center px-4">
            <div className="">

            <Separator />
            </div>
			<div className="flex w-full max-w-[84rem] justify-between">
				<div className="flex items-center">
					<Link to="/">
						<h1 className="text-xl tracking-tighter font-bold md:text-2xl">
							KhelMitra
						</h1>
					</Link>
				</div>

				<div className="flex items-center gap-4 font-semibold">
					{navLinks.map((item, index) => (
						<nav
							key={index}
							className="cursor-pointer text-sm hover:text-primary"
							// onClick={() => router(item.link)}
						>
							{item.name}
						</nav>
					))}
				</div>

				<div className="flex items-center gap-8">
					<Button
						variant="outline"
						// onClick={() => router("/auth/signin")}
					>
						Sign In
					</Button>
					<Button
					// onClick={() => router("/auth/signup")}
					>
						Sign Up
					</Button>
				</div>
			</div>
		</header>
	);
};
