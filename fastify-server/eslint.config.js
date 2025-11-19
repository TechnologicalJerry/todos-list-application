export default [
    {
        files: ["**/*.ts"],
        languageOptions: {
            parserOptions: { ecmaVersion: "latest", sourceType: "module" }
        },
        rules: {
            semi: ["error", "always"],
            quotes: ["error", "double"]
        }
    }
];
