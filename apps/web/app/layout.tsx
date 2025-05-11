import type { Metadata } from "next";
import { Play } from "next/font/google";
import "./globals.css";

import { Providers } from "@/providers/providers";
import { AppInit } from "./_app";
import { Toaster } from "sonner";

const play = Play({
	variable: "--font-play",
	subsets: ["latin"],
	weight: ["400", "700"],
});

export const metadata: Metadata = {
	title: {
		default: "Khel Mitra",
		template: "%s | Khel Mitra",
	},
	description: "Khel Mitra is a website for playing casual games with friends",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning={true}>
			<body className={`${play.variable} font-play antialiased`} cz-shortcut-listen="true">
				<Providers>
					<AppInit>
						{children}
						<Toaster />
					</AppInit>
				</Providers>
			</body>
		</html>
	);
}
