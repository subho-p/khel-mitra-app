"use client";

import { useSession } from "@/providers/session-provider";
import { Button } from "../ui/button";
import { ProfileDropdown } from "./profile-dropdown";
import { CoinsDisplay } from "./coins-display";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
	const router = useRouter();

	const { status } = useSession();

	return (
		<header className="flex w-full h-16 border-b border-border z-50 fixed top-0 bg-background/50 backdrop-blur-2xl mx-auto items-center justify-center px-4">
			<div className="flex w-full max-w-[84rem] justify-between">
				<div className="flex items-center">
					<Link href="/">
						<h1 className="text-2xl font-bold md:text-3xl">Khel Mitra</h1>
					</Link>
				</div>

				<div className="flex items-center gap-4 font-semibold">
					{navLinks.map((item, index) => (
						<nav
							key={index}
							className="cursor-pointer text-sm hover:text-primary"
							onClick={() => router.push(item.link)}
						>
							{item.name}
						</nav>
					))}
				</div>

				<div className="flex items-center gap-4">
					{status === "authenticated" ? (
						<div className="flex items-center gap-4">
							<CoinsDisplay />
							<ProfileDropdown />
						</div>
					) : (
						<>
							<Button variant="outline" onClick={() => router.push("/auth/signin")}>
								Sign In
							</Button>
							<Button onClick={() => router.push("/auth/signup")}>Sign Up</Button>
						</>
					)}
				</div>
			</div>
		</header>
	);
};
