import baseConfig from "@repo/eslint-config/base";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...baseConfig,
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      // Your existing overrides can go here
      '@typescript-eslint/no-explicit-any': 'warn',
    }
  }
]; 