// src/design-system/chakra/slot-recipes/checkbox.recipe.ts

import { defineSlotRecipe } from "@chakra-ui/react";
import { checkboxAnatomy } from "@chakra-ui/react/anatomy";

export const checkboxRecipe = defineSlotRecipe({
  slots: checkboxAnatomy.keys(),

  base: {
    control: {
      borderRadius: "xs",
    },
  },

  variants: {
    variant: {
      subtle: {
        control: {
          bg: "{colors.colorPalette.muted}",
          borderColor: "transparent",

          _checked: {
            bg: "{colors.colorPalette.solid}",
            color: "{colors.colorPalette.contrast}",
            borderColor: "transparent",
          },

          _hover: {
            bg: "{colors.colorPalette.emphasized}",
            _checked: {
              bg: "{colors.colorPalette.solid}",
            },
          },
        },
      },
    },
  },
});
