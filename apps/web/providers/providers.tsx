"use client";

import { QueryClientProvider } from "./query-client-provider";
import { SessionProvider } from "./session-provider";
import { ThemeProvider } from "./theme-provider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			<QueryClientProvider>
				<SessionProvider>{children}</SessionProvider>
			</QueryClientProvider>
		</ThemeProvider>
	);
};
