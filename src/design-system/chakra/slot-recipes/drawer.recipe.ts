// src/design-system/chakra/slot-recipes/drawer.recipe.ts

import { defineSlotRecipe } from "@chakra-ui/react";

export const drawerRecipe = defineSlotRecipe({
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
          maxW: "sm",
        },
      },

      sm: {
        content: {
          maxW: "md",
        },
      },

      md: {
        content: {
          maxW: "lg",
        },
      },

      lg: {
        content: {
          maxW: "xl",
        },
      },

      xl: {
        content: {
          maxW: "2xl",
        },
      },

      "2xl": {
        content: {
          maxW: "5xl",
        },
      },

      "3xl": {
        content: {
          maxW: "6xl",
        },
      },
    },
  },

  defaultVariants: {
    size: "md",
  },
});
