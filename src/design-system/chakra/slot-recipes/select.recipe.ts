// src/design-system/chakra/slot-recipes/select.recipe.ts

import { defineSlotRecipe } from "@chakra-ui/react";
import { selectAnatomy } from "@chakra-ui/react/anatomy";

export const selectRecipe = defineSlotRecipe({
  slots: selectAnatomy.keys(),

  variants: {
    variant: {
      outline: {
        trigger: {
          borderColor: "neutral.muted",
        },
      },
    },
  },
});
