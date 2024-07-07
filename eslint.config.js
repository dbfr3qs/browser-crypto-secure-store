import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


export default [
  {files: ["./src/**/*.{ts}"]},
  {ignores: ["**/scripts/", "**/example/", "**/dist/", "**/lib/", "**/jest-environment-jsdom.cjs", "**/*.test.ts"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
