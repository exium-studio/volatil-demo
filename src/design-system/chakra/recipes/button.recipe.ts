// src/design-system/chakra/recipes/button.recipe.ts

import { BACKDROP_FILTER_BLUR } from "@/design-system/constants/styles";
import { defineRecipe } from "@chakra-ui/react";

export const buttonRecipe = defineRecipe({
  variants: {
    variant: {
      blend: {
        bg: "bg.body",
        _hover: {
          bg: "bg.subtle",
        },
        _active: {
          bg: "bg.muted",
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
        backdropFilter: `blur(${BACKDROP_FILTER_BLUR})`,
        _hover: {
          bg: "an2",
        },
        _active: {
          bg: "an3",
        },
      },
    },
  },
});
