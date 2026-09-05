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

  // Custom linter rule: all type and interface declarations must be in .type.ts files
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/routeTree.gen.ts"],
    plugins: {
      custom: {
        rules: {
          "type-file-suffix": {
            meta: {
              type: "problem",
              docs: {
                description:
                  "Enforce all type and interface declarations to be in .type.ts files",
              },
              messages: {
                typeMustBeInTypeFile:
                  "Type and interface declarations must be in a file with .type.ts suffix. Found {{kind}} \"{{name}}\".",
              },
            },
            create(context) {
              const filename = (
                context.filename || context.getFilename()
              ).replace(/\\/g, "/");

              if (
                filename.endsWith(".type.ts") ||
                filename.endsWith(".type.tsx") ||
                filename.endsWith(".d.ts") ||
                filename.endsWith("app/router.ts")
              ) {
                return {};
              }

              return {
                TSTypeAliasDeclaration(node) {
                  context.report({
                    node,
                    messageId: "typeMustBeInTypeFile",
                    data: { kind: "type", name: node.id.name },
                  });
                },
                TSInterfaceDeclaration(node) {
                  context.report({
                    node,
                    messageId: "typeMustBeInTypeFile",
                    data: { kind: "interface", name: node.id.name },
                  });
                },
              };
            },
          },
        },
      },
    },
    rules: {
      "custom/type-file-suffix": "error",
    },
  },
]);

