"use client";

import { useGameSettings } from "@/games/game-settings.context";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";

export const GameSettings = ({
	handleBack,
	handleNext,
}: {
	handleBack: () => void;
	handleNext: () => void;
}) => {
	const settings = useGameSettings();

	function canNext() {
		if (settings.mode === "offline") {
			return true;
		} else if (settings.onlineMode === "random") {
			return true;
		} else if (settings.isAdmin === undefined) {
			return false;
		}

		return true;
	}

	return (
		<div className="flex w-full items-center justify-center mt-16 md:mt-32 px-4">
			<AnimatePresence mode="wait">
				<motion.div
					className="flex flex-col w-full max-w-xl gap-6 items-center justify-between"
					variants={containerVariants}
					initial="hidden"
					animate="show"
					exit="exit"
				>
					{/* Mode Selection */}
					<motion.div
						className="w-full flex flex-col md:flex-row gap-8 justify-between items-center"
						variants={itemVariants}
					>
						<h3 className="text-base md:text-xl font-bold">Select Mode</h3>
						<div className="flex gap-4">
							<CButton
								text="Local Game"
								onClick={() => settings.selectMode("offline")}
								isDefault={settings.mode === "offline"}
							/>
							<CButton
								text="Online Game"
								onClick={() => settings.selectMode("online")}
								isDefault={settings.mode === "online"}
							/>
						</div>
					</motion.div>

					{/* Online Mode */}
					<AnimatePresence>
						{settings.mode === "online" && (
							<motion.div
								className="w-full flex flex-col gap-6"
								variants={containerVariants}
								initial="hidden"
								animate="show"
								exit="exit"
								key="online-mode"
							>
								{/* Online Mode Selection */}
								<motion.div
									className="w-full flex flex-col md:flex-row gap-8 justify-between items-center"
									variants={itemVariants}
								>
									<h3 className="text-base md:text-xl font-bold">Player with</h3>
									<div className="flex gap-4">
										<CButton
											isDefault={settings.onlineMode === "custom"}
											onClick={() => settings.selectOnlineMode("custom")}
											text="Friends"
										/>
										<CButton
											isDefault={settings.onlineMode === "random"}
											onClick={() => settings.selectOnlineMode("random")}
											text="Random"
										/>
									</div>
								</motion.div>

								{/* Room Type */}
								{settings.onlineMode === "custom" && (
									<motion.div
										className="w-full flex flex-col md:flex-row gap-8 justify-between items-center"
										variants={itemVariants}
										key="room-type"
									>
										<h3 className="text-base md:text-xl font-bold">Select Room type</h3>
										<div className="flex gap-4">
											<CButton
												isDefault={settings.isAdmin === true}
												onClick={() => settings.setAdmin(true)}
												text="Create Room"
											/>
											<CButton
												isDefault={settings.isAdmin === false}
												onClick={() => settings.setAdmin(false)}
												text="Join Room"
											/>
										</div>
									</motion.div>
								)}
							</motion.div>
						)}
					</AnimatePresence>

					{/* Token Selection */}
					<AnimatePresence>
						{settings.isAdmin === true && (
							<motion.div
								className="w-full flex flex-col md:flex-row gap-6 items-center justify-between"
								variants={itemVariants}
								key="token-selection"
							>
								<h3 className="text-base md:text-xl font-bold">Select no of tokens</h3>
								<div className="flex gap-2">
									{[100, 200, 500, 1000].map((noOfTokens, index) => (
										<CButton
											key={index}
											text={noOfTokens.toString()}
											onClick={() => settings.selectNoOfTokens(noOfTokens)}
											isDefault={settings.token === noOfTokens}
										/>
									))}
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Navigation Buttons */}
					<motion.div className="w-full flex justify-between" variants={itemVariants}>
						<Button
							variant="outline"
							size="lg"
							className="font-semibold"
							onClick={handleBack}
						>
							<ArrowLeft className="mr-2" />
							Back
						</Button>

						<Button onClick={handleNext} disabled={!canNext()}>
							Next
							<ArrowRight className="ml-2" />
						</Button>
					</motion.div>
				</motion.div>
			</AnimatePresence>
		</div>
	);
};

const CButton = ({
	text,
	onClick,
	isDefault,
}: {
	text: string;
	onClick: () => void;
	isDefault: boolean;
}) => {
	return (
		<Button
			onClick={onClick}
			variant={isDefault ? "default" : "outline"}
			className="font-semibold"
		>
			{text}
		</Button>
	);
};

// Animation variants
const containerVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.2,
		},
	},
	exit: { opacity: 0 },
};

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	show: {
		opacity: 1,
		y: 0,
		transition: { type: "spring", stiffness: 300, damping: 24 },
	},
	exit: { opacity: 0, y: -20 },
};
