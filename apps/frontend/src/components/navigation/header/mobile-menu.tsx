import { Button } from "@/components/ui/8bit/button";
import { navLinks } from "@/constants/navlinks.constant";
import { useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";

export const MobileMenu = ({
	openMobileMenu,
	setOpenMobileMenu,
}: {
	openMobileMenu: boolean;
	setOpenMobileMenu: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const navigate = useNavigate();

	return (
		<>
			<div className="md:hidden">
				<motion.button className="" onClick={() => setOpenMobileMenu(!openMobileMenu)}>
					<AnimatePresence>
						{!openMobileMenu && (
							<motion.span
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								layoutId="mobile-menu"
							>
								<Menu className="size-8" />
							</motion.span>
						)}
					</AnimatePresence>
				</motion.button>
			</div>

			<AnimatePresence>
				{openMobileMenu && (
					<motion.div
						className="absolute top-0 right-0 w-2/3 h-screen z-100 bg-background flex flex-col items-center font-semibold py-8 gap-8 border-l border-border"
						initial={{ opacity: 0, x: "100%" }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: "100%" }}
						transition={{ duration: 0.3, ease: "linear" }}
					>
						{navLinks.map((item, index) => (
							<nav
								key={index}
								className="cursor-pointer text-sm hover:text-primary"
								onClick={() => {
									navigate({ to: item.link });
									setOpenMobileMenu(false);
								}}
							>
								{item.name}
							</nav>
						))}

						<div className="flex flex-col items-center gap-8 py-4">
							<Button
								variant="outline"
								onClick={() => {
									navigate({ to: "/auth/signin" });
									setOpenMobileMenu(false);
								}}
							>
								Sign In
							</Button>
							<Button
								onClick={() => {
									navigate({ to: "/auth/signup" });
									setOpenMobileMenu(false);
								}}
							>
								Sign Up
							</Button>
						</div>

						<motion.button
							layoutId="mobile-menu"
							className="border border-border rounded-md p-2 absolute top-3 right-3"
							onClick={() => setOpenMobileMenu(!openMobileMenu)}
						>
							<X className="size-8" />
						</motion.button>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};
