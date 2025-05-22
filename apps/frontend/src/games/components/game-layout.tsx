import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";

export const GameLayout = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
			exit={{ opacity: 0 }}
			className={cn("flex flex-col w-full items-center justify-center px-4")}
		>
			<div
				className={cn(
					"flex w-full max-w-xl gap-6 items-center justify-center mt-16 md:mt-32",
					className
				)}
			>
				{children && <AnimatePresence>{children}</AnimatePresence>}
			</div>
		</motion.div>
	);
};