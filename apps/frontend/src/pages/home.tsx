import { Games } from "@/constants/game.constant";
import { motion } from "motion/react";

import { Bot, Globe, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DisplayMap } from "@/components/display-map";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/8bit/button";

export default function Home() {
	return (
		<div>
			<section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20 min-h-[50vh] flex items-center">
				<div className="container mx-auto text-center">
					<motion.h2
						className="text-xl md:text-3xl font-bold mb-4"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						Welcome to Khel Mitra
					</motion.h2>
					<motion.p
						className="text-base text-muted-foreground mb-8"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.4 }}
					>
						Your ultimate destination for classic games and multiplayer fun!
					</motion.p>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.6 }}
					>
						<Link to="/games">
							<Button className="font-bold hover:cursor-pointer text-xl px-6 py-4 ring-2 ring-primary/40 hover:ring-primary/80 shadow hover:shadow-xl shadow-primary/20">
								Start Playing
							</Button>
						</Link>
					</motion.div>
				</div>
			</section>

			<section className="py-16 w-full">
				<div className="container mx-auto flex flex-col w-full max-w-7xl px-4">
					<h3 className="text-3xl font-bold text-center mb-12">Our Games</h3>
					<DisplayMap
						data={[...Games]}
						renderEmpty={() => <p className="text-xl text-gray-400">No games found</p>}
						renderItem={(game) => <GameCard key={game.name} game={game} />}
						className="grid grid-cols-1 md:grid-cols-3 gap-8"
					/>
				</div>
			</section>

			<section className="py-16 bg-primary/5">
				<div className="container mx-auto px-4">
					<h3 className="text-2xl md:text-3xl text-amber-500 font-bold text-center mb-12">Play Your Way</h3>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
						<PlayOption
							title="Local Multiplayer"
							description="Challenge your friends on the same device"
							icon={<Users size={40} />}
						/>
						<PlayOption
							title="Online with Friends"
							description="Connect and play with friends online"
							icon={<Globe size={40} />}
						/>
						<PlayOption
							title="Play with AI"
							description="Test your skills against our intelligent AI"
							icon={<Bot size={40} />}
						/>
					</div>
				</div>
			</section>
		</div>
	);
}

function GameCard({ game }: { game: (typeof Games)[number] }) {
	const navigate = useNavigate();

	return (
		<motion.div
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			transition={{ delay: 0.15, duration: 0.2, damping: 300 }}
		>
			<Card
				className="md:min-h-80 bg-muted border-muted-foreground/50 shadow-inherit hover:cursor-pointer"
				onClick={() => navigate({ to: game.link })}
			>
				<CardHeader>
					<CardTitle className="text-center">
						<div className="text-primary mb-4 flex justify-center">
							<game.icon size={40} />
						</div>
						{game.name}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-center text-muted-foreground text-sm indent-2">
						{game.description}
					</p>
				</CardContent>
			</Card>
		</motion.div>
	);
}

const PlayOption: React.FC<{
	title: string;
	description: string;
	icon: React.ReactNode;
}> = ({ title, description, icon }) => {
	return (
		<motion.div
			className="flex flex-col items-center"
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			viewport={{ once: true }}
		>
			<div className="text-primary mb-4">{icon}</div>
			<h4 className="text-base font-semibold mb-4">{title}</h4>
			<p className="text-sm md:text-base text-muted-foreground">{description}</p>
		</motion.div>
	);
};
