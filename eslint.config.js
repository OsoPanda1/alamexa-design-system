import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"

export default tseslint.config(
  {
    ignores: ["dist", "node_modules", "coverage", "**/*.d.ts"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      // Opcional: si quieres reglas extra de hooks
      // reactHooks.configs["recommended-latest"],
      // Opcional: preset vite ya trae la regla de only-export-components
      // reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      // Hooks
      ...reactHooks.configs.recommended.rules,
      // Fast Refresh: permite exports constantes (útil en Vite)
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      // Para Alamexa vas a iterar mucho, mejor no bloquear por esto
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
)
