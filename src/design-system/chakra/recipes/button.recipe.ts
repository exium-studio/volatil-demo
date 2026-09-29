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
        position: "relative",
        isolation: "isolate",
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
          _light: "rgba(255, 255, 255, 0.35)",
          _dark: "rgba(255, 255, 255, 0.06)",
        },
        // Soft inner glow only, the sharp corner highlight is handled by ::before
        boxShadow: {
          _light:
            "inset -2px 2px 8px 0px rgba(255, 255, 255, 0.35), inset 2px -2px 8px 0px rgba(255, 255, 255, 0.2), 0 2px 8px -2px rgba(0, 0, 0, 0.06)",
          _dark:
            "inset -2px 2px 8px 0px rgba(255, 255, 255, 0.1), inset 2px -2px 8px 0px rgba(255, 255, 255, 0.05), 0 2px 8px -2px rgba(0, 0, 0, 0.35)",
        },
        transition:
          "background 150ms ease, border-color 150ms ease, box-shadow 150ms ease, transform 100ms ease",

        // Gradient rim: bright at top-right and bottom-left, fades toward the center
        _before: {
          content: '""',
          position: "absolute",
          inset: "0",
          padding: "1px",
          borderRadius: "inherit",
          pointerEvents: "none",
          background: {
            _light:
              "linear-gradient(45deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0) 70%, rgba(255,255,255,1) 100%)",
            _dark:
              "linear-gradient(45deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.4) 100%)",
          },
          // Punch out the center so only the 1px ring remains
          mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          maskComposite: "exclude",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          transition: "opacity 150ms ease",
        },

        _hover: {
          bg: {
            _light: "rgba(255, 255, 255, 0.78)",
            _dark: "rgba(39, 39, 42, 0.78)",
          },
          boxShadow: {
            _light:
              "inset -2px 2px 10px 0px rgba(255, 255, 255, 0.45), inset 2px -2px 10px 0px rgba(255, 255, 255, 0.3), 0 4px 12px -2px rgba(0, 0, 0, 0.08)",
            _dark:
              "inset -2px 2px 10px 0px rgba(255, 255, 255, 0.15), inset 2px -2px 10px 0px rgba(255, 255, 255, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.45)",
          },
        },

        _active: {
          bg: {
            _light: "rgba(255, 255, 255, 0.88)",
            _dark: "rgba(39, 39, 42, 0.88)",
          },
          boxShadow: {
            _light: "inset 0 1px 3px 0 rgba(0, 0, 0, 0.08)",
            _dark: "inset 0 1px 3px 0 rgba(0, 0, 0, 0.3)",
          },
          // Dim the rim so the button feels pressed
          _before: {
            opacity: 0.5,
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
