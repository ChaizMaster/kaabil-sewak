import baseConfig from "@repo/eslint-config/base";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...baseConfig,
  {
    rules: {
      // Your existing overrides can go here
      '@typescript-eslint/no-explicit-any': 'warn',
    }
  }
]; 