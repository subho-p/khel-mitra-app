import React from "react";
import type { IAuthContext } from "@/types/auth.context.type";

export const AuthContext = React.createContext<IAuthContext | undefined>(undefined);

export const useAuth = () => {
    const context = React.useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth must be used within a AuthProvider.");
    }
    
    return context;
}
