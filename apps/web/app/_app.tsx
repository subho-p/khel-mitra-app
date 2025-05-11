'use client'

import { useSession } from "@/providers/session-provider";

export const AppInit = ({ children }: { children: React.ReactNode }) => {
    const { status } = useSession()

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
};