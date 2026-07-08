// src/design-system/chakra/slot-recipes/dialog.recipe.ts

import { defineSlotRecipe } from "@chakra-ui/react";

export const dialogRecipe = defineSlotRecipe({
  slots: [
    "backdrop",
    "positioner",
    "content",
    "header",
    "body",
    "footer",
    "title",
    "description",
    "closeTrigger",
  ],

  variants: {
    size: {
      xs: {
        content: {
          maxW: "xs",
        },
      },

      sm: {
        content: {
          maxW: "sm",
        },
      },

      md: {
        content: {
          maxW: "md",
        },
      },

      lg: {
        content: {
          maxW: "lg",
        },
      },

      xl: {
        content: {
          maxW: "xl",
        },
      },

      "2xl": {
        content: {
          maxW: "2xl",
        },
      },

      "3xl": {
        content: {
          maxW: "3xl",
        },
      },

      "4xl": {
        content: {
          maxW: "4xl",
        },
      },

      "5xl": {
        content: {
          maxW: "5xl",
        },
      },
    },
  },

  defaultVariants: {
    size: "md",
  },
});
