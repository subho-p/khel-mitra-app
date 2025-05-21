import { Button } from "@/components/ui/8bit/button";
import { Link, useNavigate } from "@tanstack/react-router";
import React from "react";
import { useSession } from "@/hooks/use-session";
import { MobileMenu } from "./mobile-menu";
import { navLinks } from "@/constants/navlinks.constant";
import { UserDropdown } from "./user-dropdown";

export const Header = () => {
	const navigate = useNavigate();
	const [openMobileMenu, setOpenMobileMenu] = React.useState(false);

	const { isAuthenticated } = useSession();

	return (
		<div className="relative">
			<header className="flex w-full h-16 border-b border-border z-50 fixed top-0 bg-background/50 backdrop-blur-2xl mx-auto items-center justify-center px-4">
				<div className="flex w-full max-w-7xl justify-between relative">
					<div className="flex items-center">
						<Link to="/">
							<h1 className="text-xl tracking-tighter font-bold md:text-2xl">
								KhelMitra
							</h1>
						</Link>
					</div>

					<div className="hidden md:flex items-center gap-4 font-semibold">
						{navLinks.map((item, index) => (
							<nav
								key={index}
								className="cursor-pointer text-sm hover:text-primary"
								onClick={() => navigate({ to: item.link })}
							>
								{item.name}
							</nav>
						))}
					</div>

					<div className="hidden md:flex items-center gap-8">
						{isAuthenticated ? (
							<UserDropdown />
						) : (
							<>
								<Button
									variant="outline"
									onClick={() => navigate({ to: "/auth/signin" })}
								>
									Sign In
								</Button>
								<Button onClick={() => navigate({ to: "/auth/signup" })}>
									Sign Up
								</Button>
							</>
						)}
					</div>

					<MobileMenu
						openMobileMenu={openMobileMenu}
						setOpenMobileMenu={setOpenMobileMenu}
					/>
				</div>
			</header>
		</div>
	);
};
