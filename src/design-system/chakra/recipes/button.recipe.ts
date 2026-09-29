// src/design-system/chakra/recipes/button.recipe.ts

import { defineRecipe } from "@chakra-ui/react";

export const buttonRecipe = defineRecipe({
  variants: {
    variant: {
      subtle: {
        bg: "colorPalette.subtle",
        color: "colorPalette.fg",
        _hover: {
          bg: "colorPalette.muted",
        },
        _active: {
          bg: "colorPalette.muted",
        },
      },
      blend: {
        bg: "bg.body",
        _hover: {
          // bg: "bg.subtle",
        },
        _active: {
          // bg: "bg.muted",
        },
      },

      adaptive: {
        bg: "an1",
        _hover: {
          bg: "an2",
        },
        _active: {
          bg: "an3",
        },
      },

      frosted: {
        bg: "bg.bodyAlpha",
        backdropFilter: `blur(10px)`,
        _hover: {
          bg: "an1",
        },
        _active: {
          bg: "an2",
        },
      },

      glass: {
        bg: {
          _light: "rgba(255, 255, 255, 0.65)",
          _dark: "rgba(24, 24, 27, 0.65)",
        },
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        color: "fg",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: {
          _light: "rgba(255, 255, 255, 0.6)",
          _dark: "rgba(255, 255, 255, 0.12)",
        },
        boxShadow: {
          _light:
            "inset -1px 1px 2px 0px rgba(255, 255, 255, 0.85), inset -2px 2px 6px 0px rgba(255, 255, 255, 0.35), inset 1px -1px 1.5px 0px rgba(255, 255, 255, 0.45), 0 2px 8px -2px rgba(0, 0, 0, 0.06)",
          _dark:
            "inset -1px 1px 2px 0px rgba(255, 255, 255, 0.22), inset -2px 2px 6px 0px rgba(255, 255, 255, 0.1), inset 1px -1px 1.5px 0px rgba(255, 255, 255, 0.1), 0 2px 8px -2px rgba(0, 0, 0, 0.35)",
        },
        transition:
          "background 150ms ease, border-color 150ms ease, box-shadow 150ms ease, transform 100ms ease",
        _hover: {
          bg: {
            _light: "rgba(255, 255, 255, 0.78)",
            _dark: "rgba(39, 39, 42, 0.78)",
          },
          borderColor: {
            _light: "rgba(255, 255, 255, 0.8)",
            _dark: "rgba(255, 255, 255, 0.2)",
          },
          boxShadow: {
            _light:
              "inset -1px 1px 2.5px 0px rgba(255, 255, 255, 0.95), inset -2px 2px 8px 0px rgba(255, 255, 255, 0.45), inset 1px -1px 2px 0px rgba(255, 255, 255, 0.55), 0 4px 12px -2px rgba(0, 0, 0, 0.08)",
            _dark:
              "inset -1px 1px 2.5px 0px rgba(255, 255, 255, 0.3), inset -2px 2px 8px 0px rgba(255, 255, 255, 0.15), inset 1px -1px 2px 0px rgba(255, 255, 255, 0.15), 0 4px 12px -2px rgba(0, 0, 0, 0.45)",
          },
        },
        _active: {
          bg: {
            _light: "rgba(255, 255, 255, 0.88)",
            _dark: "rgba(39, 39, 42, 0.88)",
          },
          boxShadow: {
            _light:
              "inset 0 1px 3px 0 rgba(0, 0, 0, 0.08), inset -1px 1px 1.5px 0px rgba(255, 255, 255, 0.6), inset 1px -1px 1px 0px rgba(255, 255, 255, 0.3)",
            _dark:
              "inset 0 1px 3px 0 rgba(0, 0, 0, 0.3), inset -1px 1px 1.5px 0px rgba(255, 255, 255, 0.15), inset 1px -1px 1px 0px rgba(255, 255, 255, 0.08)",
          },
        },
      },

      whiteAlphaGhost: {
        _hover: {
          bg: "whiteAlpha.100",
        },
        _active: {
          bg: "whiteAlpha.200",
        },
      },
    },
  },
});
