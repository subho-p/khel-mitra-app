import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function RootLayout({
	children,
	modal,
}: Readonly<{
	children: React.ReactNode;
	modal: React.ReactNode;
}>) {
	return (
		<>
			<div className="flex flex-col w-full min-h-[100svh]">
				<Header />
				<main className="flex-1 w-full min-h-[calc(100svh-4rem)] pt-16">
					{children}
					{modal}
				</main>
			</div>
			<Footer />
		</>
	);
}
