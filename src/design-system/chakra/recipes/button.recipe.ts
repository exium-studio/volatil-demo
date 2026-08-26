// src/design-system/chakra/recipes/button.recipe.ts

import { defineRecipe } from "@chakra-ui/react";

export const buttonRecipe = defineRecipe({
  variants: {
    variant: {
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
        bg: "an1",
        backdropFilter: `blur(10px)`,
        _hover: {
          bg: "an2",
        },
        _active: {
          bg: "an3",
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
