import { createContext, type ReactNode, useContext } from "react";

export function createReactContext<T>(
    init: () => T,
    name: string,
    defaultValue: T | undefined = undefined
) {
    const context = createContext<T | undefined>(defaultValue);

    function Provider({ children }: { children: ReactNode }) {
        const value = init();
        return <context.Provider value={value}>{children}</context.Provider>;
    }

    function useModifyContext() {
        const value = useContext(context);
        if (value === undefined) {
            throw new Error(`use${name} must be used within a ${name}Provider.`);
        }
        return value;
    }

    return {
        context,
        Provider,
        useContext: useModifyContext,
    };
}
