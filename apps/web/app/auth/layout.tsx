import { Play } from "next/font/google";

const play = Play({
	variable: "--font-play",
	subsets: ["latin"],
	weight: "700",
});

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
			<div className={`${play.className} text-xl font-bold md:text-3xl`}>KhelMitra</div>
			<div className="w-full max-w-sm">{children}</div>
		</main>
	);
}
