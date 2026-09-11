// src/design-system/chakra/recipes/input.recipe.ts

import { defineRecipe } from "@chakra-ui/react";

export const inputRecipe = defineRecipe({
  variants: {
    variant: {
      outline: {
        borderColor: "neutral.muted",
      },
      subtle: {
        bg: "bg.subtle",
      },
      blend: {
        bg: "bg.body",
        _hover: {},
        _active: {},
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
