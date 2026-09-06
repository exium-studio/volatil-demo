import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([
    "dist",
    "src/routeTree.gen.ts",
    "project.inlang",
    "src/paraglide",
  ]),

  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },

  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },

  // Only src/design-system may import from @chakra-ui/react.
  {
    files: ["**/*.{ts,tsx}"],
    ignores: ["src/design-system/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@chakra-ui/react",
              message:
                "Only src/design-system may import from @chakra-ui/react.",
            },
          ],
        },
      ],
    },
  },

  // Disallow type/interface declarations outside of .type.ts, .type.tsx, or .d.ts files
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: [
      "**/*.type.ts",
      "**/*.type.tsx",
      "**/*.d.ts",
      "src/routeTree.gen.ts",
      "src/paraglide/**/*",
      "src/app/router.ts",
    ],
    plugins: {
      custom: {
        rules: {
          "no-inline-type": {
            create(context) {
              return {
                TSTypeAliasDeclaration(node) {
                  context.report({
                    node,
                    message:
                      "Type declarations are forbidden outside of .type.ts files. Move type to nearest types/ folder with .type.ts suffix.",
                  });
                },
                TSInterfaceDeclaration(node) {
                  context.report({
                    node,
                    message:
                      "Interface declarations are forbidden outside of .type.ts files. Move type to nearest types/ folder with .type.ts suffix.",
                  });
                },
                ExportNamedDeclaration(node) {
                  if (node.exportKind === "type") {
                    context.report({
                      node,
                      message:
                        "Exporting types is forbidden outside of .type.ts files. Move type to nearest types/ folder with .type.ts suffix.",
                    });
                  }
                },
              };
            },
          },
        },
      },
    },
    rules: {
      "custom/no-inline-type": "error",
    },
  },
]);
