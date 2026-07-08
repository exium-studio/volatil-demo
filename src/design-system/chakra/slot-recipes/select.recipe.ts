// src/design-system/chakra/slot-recipes/select.recipe.ts

import { defineSlotRecipe } from "@chakra-ui/react";

export const selectRecipe = defineSlotRecipe({
  slots: [
    "root",
    "control",
    "trigger",
    "valueText",
    "indicatorGroup",
    "indicator",
    "positioner",
    "content",
    "item",
    "itemIndicator",
  ],

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
