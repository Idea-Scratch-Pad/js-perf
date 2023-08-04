/* eslint-env node */
module.exports = {
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
    parserOptions: {
        parser: "@typescript-eslint/parser",
        project: "./tsconfig.eslint.json",
    },
    plugins: ["@typescript-eslint"],
    root: true,
    rules: {
        "@typescript-eslint/no-namespace": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-floating-promises": "error",
    },
};
