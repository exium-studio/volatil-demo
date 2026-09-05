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

  // Disallow export type in any file that is not a .type.ts or .d.ts file
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["**/*.type.ts", "**/*.type.tsx", "**/*.d.ts", "src/routeTree.gen.ts"],
    plugins: {
      custom: {
        rules: {
          "no-export-type": {
            create(context) {
              return {
                ExportNamedDeclaration(node) {
                  if (node.exportKind === "type") {
                    context.report({
                      node,
                      message:
                        "Exporting types is forbidden outside of .type.ts files. Move type to nearest types/ folder with .type.ts suffix.",
                    });
                    return;
                  }

                  if (node.declaration?.type === "TSTypeAliasDeclaration") {
                    context.report({
                      node: node.declaration,
                      message:
                        "Exporting type aliases is forbidden outside of .type.ts files. Move type to nearest types/ folder with .type.ts suffix.",
                    });
                    return;
                  }

                  if (node.declaration?.type === "TSInterfaceDeclaration") {
                    context.report({
                      node: node.declaration,
                      message:
                        "Exporting interfaces is forbidden outside of .type.ts files. Move type to nearest types/ folder with .type.ts suffix.",
                    });
                    return;
                  }

                  for (const specifier of node.specifiers || []) {
                    if (specifier.exportKind === "type") {
                      context.report({
                        node: specifier,
                        message:
                          "Exporting types is forbidden outside of .type.ts files. Move type to nearest types/ folder with .type.ts suffix.",
                      });
                    }
                  }
                },
              };
            },
          },
        },
      },
    },
    rules: {
      "custom/no-export-type": "error",
    },
  },
]);
