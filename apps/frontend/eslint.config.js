import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
    { ignores: ["dist"] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

            // add your custom rules
            "@typescript-eslint/no-explicit-any": "off", // Disallow `any`
            "@typescript-eslint/no-unused-vars": "error", // Disallow unused variables
            "@typescript-eslint/no-unused-vars-experimental": "off", // Disable the experimental rule
            "@typescript-eslint/no-unused-vars": ["off", { argsIgnorePattern: "^_" }], // Ignore unused args prefixed with _
        },
    }
);
