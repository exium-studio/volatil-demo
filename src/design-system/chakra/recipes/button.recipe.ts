// src/design-system/chakra/recipes/button.recipe.ts

import { defineRecipe } from "@chakra-ui/react";

export const buttonRecipe = defineRecipe({
  variants: {
    variant: {
      blend: {
        bg: "bg.body",
        _hover: {
          bg: "bg.subtle",
        },
      },

      adaptive: {},

      frosted: {},
    },
  },
});
