// src/design-system/chakra/slot-recipes/carousel.recipe.ts

// theme/recipes/carousel.ts

import { carouselAnatomy } from "@chakra-ui/react/anatomy";
import { defineSlotRecipe } from "@chakra-ui/react";

export const carouselRecipe = defineSlotRecipe({
  slots: carouselAnatomy.keys(),

  base: {
    indicatorGroup: {
      gap: 2,
    },
  },
});
