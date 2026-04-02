
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";

export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReactConfig,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node }
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off",
      "no-restricted-imports": [
        "error",
        {
          patterns: ["firebase/compat/*", "firebase/compat"]
        }
      ]
    }
  },
  { ignores: ["node_modules/", ".next/"] },
];
