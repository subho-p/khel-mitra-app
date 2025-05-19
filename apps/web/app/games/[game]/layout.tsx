import { Header } from "@/components/header";
import { Games } from "@/constants/game.constant";
import { GameSettingsProvider } from "@/games/game-settings.context";

type Params = Promise<{ game: string }>;

const getGameData = (game: string) => {
	const gameData = Games.find((g) => g.link.split("/")[2] === game);
	return gameData;
};

const getGameName = (game: string) => {
	const gameName = game
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
	return gameName;
};

export async function generateMetadata({ params }: { params: Params }) {
	const { game } = await params;
	const gameData = getGameData(game);

	if (!gameData) {
		const gameName = getGameName(game);
		return {
			title: gameName,
			description: `${gameName} Game not found`,
		};
	} else {
		return {
			title: gameData.name,
			description: gameData.description,
		};
	}
}

export default async function RootLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: Params;
}>) {
	const { game } = await params;
	const gameData = getGameData(game);

	return (
		<>
			<div className="flex flex-col w-full min-h-[100svh]">
				<Header />
				<main className="flex-1 w-full min-h-[calc(100svh-4rem)] pt-16">
					<div className="w-full h-full max-w-7xl mx-auto relative">
						{gameData ? (
							<GameSettingsProvider>
								<h1 className="text-primary text-2xl font-bold md:text-3xl py-2 text-center text-shadow-md text-shadow-primary/50">
									{gameData.name}
								</h1>
								<div className="flex flex-col h-[calc(100svh-10rem)] gap-4">
									{children}
								</div>
							</GameSettingsProvider>
						) : (
							<>
								<h1 className="text-primary text-2xl font-bold md:text-3xl py-2 text-center text-shadow-md text-shadow-primary/50">
									{getGameName(game)}
								</h1>
								<div className="text-destructive text-center text-2xl py-4">
									Game not found
								</div>
							</>
						)}
					</div>
				</main>
			</div>
		</>
	);
}
