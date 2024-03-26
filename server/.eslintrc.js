module.exports = {
    env: {
        es2021: true,
    },
    extends: ["standard-with-typescript", "prettier"],
    overrides: [],
    parser: `@typescript-eslint/parser`,
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json"],
    },
    rules: {
        "@typescript-eslint/no-misused-promises": [
            "error",
            {
                checksVoidReturn: false,
            },
        ],
        "@typescript-eslint/strict-boolean-expressions": 0
    },
};