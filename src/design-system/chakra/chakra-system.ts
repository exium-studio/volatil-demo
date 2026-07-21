// src/design-system/chakra/chakra-system.ts

import { buttonRecipe } from "@/design-system/chakra/recipes/button.recipe";
import { inputRecipe } from "@/design-system/chakra/recipes/input.recipe";
import { carouselRecipe } from "@/design-system/chakra/slot-recipes/carousel.recipe";
import { checkboxRecipe } from "@/design-system/chakra/slot-recipes/checkbox.recipe";
import { dialogRecipe } from "@/design-system/chakra/slot-recipes/dialog.recipe";
import { drawerRecipe } from "@/design-system/chakra/slot-recipes/drawer.recipe";
import { selectRecipe } from "@/design-system/chakra/slot-recipes/select.recipe";
import {
  DIALOG_OFFSET_X_VAR,
  DIALOG_OFFSET_Y_VAR,
} from "@/design-system/components/overlay/stores/dialog-animation-store";
import { SM_SCREEN_BREAKPOINT } from "@/design-system/constants/styles";
import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

export const chakraConfig = defineConfig({
  conditions: {
    hover: "&:is(:hover, [data-hover]):not(:disabled, [data-disabled])",
  },

  globalCss: {
    "html, body": {
      bg: "bg.body",
      fontWeight: "normal",
    },
    "div, p, button, input, span, section, article, li, ul, ol, a, label, strong, em":
      {
        fontSize: "md",
        fontWeight: "normal",
      },
  },

  // Theme config ---------------------------------------------------

  theme: {
    breakpoints: {
      sm: "320px",
      md: SM_SCREEN_BREAKPOINT,
      lg: "960px",
      xl: "1200px",
    },

    keyframes: {
      "scale-up": {
        "0%": {
          transform: "scale(0.25)",
          opacity: 0,
        },
        "100%": {
          transform: "scale(1)",
          opacity: 1,
        },
      },

      "scale-up-overshoot": {
        "0%": {
          transform: "scale(0.85)",
          opacity: 0,
        },
        "50%": {
          transform: "scale(1.015)",
          opacity: 1,
        },
        "100%": {
          transform: "scale(1)",
        },
      },

      "scale-up-overshoot-from-click-origin": {
        "0%": {
          transform: `translate(var(${DIALOG_OFFSET_X_VAR}), var(${DIALOG_OFFSET_Y_VAR})) scale(0)`,
          opacity: 0,
        },
        "50%": {
          transform: "translate(0, 0) scale(1.015)",
        },
        "100%": {
          transform: "translate(0, 0) scale(1)",
          opacity: 1,
        },
      },

      "scale-down": {
        "0%": {
          transform: "scale(1)",
          opacity: 1,
        },
        "100%": {
          transform: "scale(0.85)",
          opacity: 0,
        },
      },

      "scale-down-to-click-origin": {
        "0%": {
          transform: "translate(0, 0) scale(1)",
          opacity: 1,
        },
        "100%": {
          transform: `translate(var(${DIALOG_OFFSET_X_VAR}), var(${DIALOG_OFFSET_Y_VAR})) scale(0)`,
          opacity: 0,
        },
      },

      "shrink-x": {
        "0%": {
          transform: "scaleX(1)",
        },
        "100%": {
          transform: `scaleX(0)`,
        },
      },
    },

    tokens: {
      colors: {
        canvasLight: { value: "#f8f8f9" },
        canvasDark: { value: "#1a1a1a" },

        bodyLight: { value: "#ffffff" },
        bodyDark: { value: "#1f1f1f" },

        an0: { value: "#757b800f" },
        an1: { value: "#757b801f" },
        an2: { value: "#757b802f" },
        an3: { value: "#757b803f" },
        an4: { value: "#757b804f" },

        placeholder: { value: "#96969691" },

        neutral: {
          50: { value: "#f8f8fa" },
          100: { value: "#f3f3f5" },
          200: { value: "#ececef" },
          300: { value: "#dbdbdd" },
          400: { value: "#a5a5ad" },
          500: { value: "#6e6e76" },
          600: { value: "#66615c" },
          700: { value: "#3d3f3f" },
          800: { value: "#2e2f2f" },
          900: { value: "#292929" },
          950: { value: "#252525" },
        },

        // gray: {
        //   50: { value: "#f8f8f8" },

        //   100: { value: "#f3f3f5" },

        //   200: { value: "#e8e8e9" },

        //   300: { value: "#dbdbdd" },

        //   // fg.muted-dark
        //   // fg.subtle-light
        //   400: { value: "#a5a5ad" },

        //   // fg.subtle-dark
        //   500: { value: "#6e6e76" },

        //   // fg.muted-light
        //   600: { value: "#66615c" },

        //   // placeholder-light
        //   700: { value: "#3d3f3f" },

        //   800: { value: "#2e2f2f" },

        //   900: { value: "#292929" },

        //   950: { value: "#171717" },
        // },

        // slight blue tint
        grey: {
          50: { value: "#e7eaec" },
          100: { value: "#dde1e4" },
          200: { value: "#cdd3d7" },
          300: { value: "#b7bfc5" },
          400: { value: "#959fa7" },
          500: { value: "#848d95" },
          600: { value: "#606970" },
          700: { value: "#4b5258" },
          800: { value: "#373c41" },
          900: { value: "#282c30" },
          950: { value: "#1e2124" },
        },

        cream: {
          50: { value: "#f6f0ea" },
          100: { value: "#f3ebdb" },
          200: { value: "#EFE5CE" },
          300: { value: "#E7D9B8" },
          400: { value: "#DFCCA2" },
          500: { value: "#d0bb90" },
          600: { value: "#ad9a76" },
          700: { value: "#887655" },
          800: { value: "#5c4f3a" },
          900: { value: "#3a3124" },
          950: { value: "#262017" },
        },

        caramel: {
          50: { value: "#f3e9df" },
          100: { value: "#F4E0C9" },
          200: { value: "#E8C7A0" },
          300: { value: "#DCAE78" },
          400: { value: "#D0944F" },
          500: { value: "#bb7a36" },
          600: { value: "#a36933" },
          700: { value: "#8a582d" },
          800: { value: "#524033" },
          900: { value: "#3d2d24" },
          950: { value: "#29211c" },
        },

        mocha: {
          50: { value: "#f3e7e2ff" },
          100: { value: "#EAD7CF" },
          200: { value: "#D7B8A9" },
          300: { value: "#C49A84" },
          400: { value: "#B27B5E" },
          500: { value: "#996043" },
          600: { value: "#85523D" },
          700: { value: "#6E4434" },
          800: { value: "#3f302b" },
          900: { value: "#3d2c27" },
          950: { value: "#26201d" },
        },

        brown: {
          50: { value: "#eae3df" },
          100: { value: "#D7CCC8" },
          200: { value: "#BCAAA4" },
          300: { value: "#A1887F" },
          400: { value: "#8D6E63" },
          500: { value: "#795548" },
          600: { value: "#6b4f45" },
          700: { value: "#5a433b" },
          800: { value: "#413533" },
          900: { value: "#37302c" },
          950: { value: "#2a2523" },
        },

        maroon: {
          50: { value: "#f4e2e2" },
          100: { value: "#F2C8C8" },
          200: { value: "#E69E9E" },
          300: { value: "#D97373" },
          400: { value: "#C94C4C" },
          500: { value: "#8f2e35" },
          600: { value: "#75262c" },
          700: { value: "#5c1f23" },
          800: { value: "#522f30" },
          900: { value: "#3c2122" },
          950: { value: "#301c1d" },
        },

        red: {
          50: { value: "#f6e6e6" },
          100: { value: "#fee2e2" },
          200: { value: "#fecaca" },
          300: { value: "#fca5a5" },
          400: { value: "#f87171" },
          500: { value: "#d45252" },
          600: { value: "#b94747" },
          700: { value: "#963c3c" },
          800: { value: "#4c2c2c" },
          900: { value: "#3e2424" },
          950: { value: "#2b1c1c" },
        },

        salmon: {
          50: { value: "#f5e6de" },
          100: { value: "#FFE0DA" },
          200: { value: "#FFC1B3" },
          300: { value: "#FFA18D" },
          400: { value: "#FF8267" },
          500: { value: "#d97463" },
          600: { value: "#bf6658" },
          700: { value: "#9e564c" },
          800: { value: "#5f4440" },
          900: { value: "#47312f" },
          950: { value: "#322524" },
        },

        pastelOrange: {
          50: { value: "#f5e7dfff" },
          100: { value: "#f5dfd8" },
          200: { value: "#FFD4C1" },
          300: { value: "#FFBDA1" },
          400: { value: "#FFA581" },
          500: { value: "#FF8E62" },
          600: { value: "#E67C4F" },
          700: { value: "#B3623F" },
          800: { value: "#674739" },
          900: { value: "#4e3326" },
          950: { value: "#38271f" },
        },

        orange: {
          50: { value: "#f5e6d6ff" },
          100: { value: "#f2dfc9ff" },
          200: { value: "#fed7aa" },
          300: { value: "#fdba74" },
          400: { value: "#fb923c" },
          500: { value: "#f97316" },
          600: { value: "#d86a2c" },
          700: { value: "#b35a2a" },
          800: { value: "#693e28" },
          900: { value: "#4d302a" },
          950: { value: "#34211f" },
        },

        gold: {
          50: { value: "#f3e9cbff" },
          100: { value: "#ffefbf" },
          200: { value: "#ffe08a" },
          300: { value: "#ffd24d" },
          400: { value: "#f5c33a" },
          500: { value: "#D1B000" },
          600: { value: "#b89a32" },
          700: { value: "#9c852c" },
          800: { value: "#615732" },
          900: { value: "#544c2f" },
          950: { value: "#3a3524" },
        },

        yellow: {
          50: { value: "#fbf7c4ff" },
          100: { value: "#fff7b8" },
          200: { value: "#eae1af" },
          300: { value: "#ffe14d" },
          400: { value: "#ffd633" },
          500: { value: "#ffcc00" },
          600: { value: "#d9b326" },
          700: { value: "#806b20" },
          800: { value: "#5d522a" },
          900: { value: "#474029" },
          950: { value: "#322e20" },
        },

        lime: {
          50: { value: "#edf2c4ff" },
          100: { value: "#e8ecb2" },
          200: { value: "#dde590" },
          300: { value: "#DCE775" },
          400: { value: "#D4E157" },
          500: { value: "#CDDC39" },
          600: { value: "#b8c84a" },
          700: { value: "#6e7535" },
          800: { value: "#40442c" },
          900: { value: "#3b3e2a" },
          950: { value: "#2e311f" },
        },

        olive: {
          50: { value: "#ebf0cfff" },
          100: { value: "#DDE3C4" },
          200: { value: "#C7D29F" },
          300: { value: "#B1C17A" },
          400: { value: "#9CB055" },
          500: { value: "#879F30" },
          600: { value: "#758B2B" },
          700: { value: "#637726" },
          800: { value: "#404e1d" },
          900: { value: "#38431c" },
          950: { value: "#212a13" },
        },

        green: {
          50: { value: "#d6f6dfff" },
          100: { value: "#c9f2d7" },
          200: { value: "#b2eec7" },
          300: { value: "#86efac" },
          400: { value: "#4ade80" },
          500: { value: "#22c55e" },
          600: { value: "#16a34a" },
          700: { value: "#116932" },
          800: { value: "#1a3b1c" },
          900: { value: "#1b331c" },
          950: { value: "#182415" },
        },

        jade: {
          50: { value: "#d6f7e7ff" },
          100: { value: "#c9eeda" },
          200: { value: "#aee2c6" },
          300: { value: "#6FDEA5" },
          400: { value: "#46D58D" },
          500: { value: "#2ECC71" },
          600: { value: "#26A75C" },
          700: { value: "#1E8449" },
          800: { value: "#173425" },
          900: { value: "#192e22" },
          950: { value: "#14221a" },
        },

        teal: {
          50: { value: "#d2f4ecff" },
          100: { value: "#baefe3" },
          200: { value: "#adf0e2" },
          300: { value: "#5eead4" },
          400: { value: "#2dd4bf" },
          500: { value: "#14b8a6" },
          600: { value: "#0d9488" },
          700: { value: "#0c5d56" },
          800: { value: "#203f3e" },
          900: { value: "#1c3736" },
          950: { value: "#142322" },
        },

        tealBlue: {
          50: { value: "#d3f3efff" },
          100: { value: "#c6ece7" },
          200: { value: "#bcede6" },
          300: { value: "#69D2CD" },
          400: { value: "#42BFC0" },
          500: { value: "#1FA8B1" },
          600: { value: "#188893" },
          700: { value: "#126B76" },
          800: { value: "#194347" },
          900: { value: "#163034" },
          950: { value: "#122223" },
        },

        cyan: {
          50: { value: "#d1f1f2ff" },
          100: { value: "#c1eff3" },
          200: { value: "#b6eaf1" },
          300: { value: "#67e8f9" },
          400: { value: "#22d3ee" },
          500: { value: "#06b6d4" },
          600: { value: "#0891b2" },
          700: { value: "#0c5c72" },
          800: { value: "#2a4a55" },
          900: { value: "#1a2f37" },
          950: { value: "#192328" },
        },

        sky: {
          50: { value: "#dbeaf7ff" },
          100: { value: "#cfe7f7" },
          200: { value: "#c9e7f8" },
          300: { value: "#7DD3FC" },
          400: { value: "#38BDF8" },
          500: { value: "#0EA5E9" },
          600: { value: "#0284C7" },
          700: { value: "#0369A1" },
          800: { value: "#12384a" },
          900: { value: "#13313e" },
          950: { value: "#0d222b" },
        },

        powderBlue: {
          50: { value: "#dceaf7ff" },
          100: { value: "#cee0efff" },
          200: { value: "#c1def7" },
          300: { value: "#9ecaf0" },
          400: { value: "#7fb4e6" },
          500: { value: "#649fd9" },
          600: { value: "#4f86bf" },
          700: { value: "#3f6ba1" },
          800: { value: "#223249" },
          900: { value: "#202e3c" },
          950: { value: "#19222c" },
        },

        blue: {
          50: { value: "#e3f4ff" },
          100: { value: "#c9e5ff" },
          200: { value: "#a8cff7" },
          300: { value: "#7cacdf" },
          400: { value: "#4587c8" },
          500: { value: "#1860a9" },
          600: { value: "#004b8d" },
          700: { value: "#00386e" },
          800: { value: "#002750" },
          900: { value: "#001837" },
          950: { value: "#000e21" },
        },

        sapphire: {
          50: { value: "#dee7f6ff" },
          100: { value: "#D5E2FF" },
          200: { value: "#b6c9fb" },
          300: { value: "#7B9BFF" },
          400: { value: "#4E75FF" },
          500: { value: "#1939B7" },
          600: { value: "#152F9B" },
          700: { value: "#10237B" },
          800: { value: "#242d53" },
          900: { value: "#202745" },
          950: { value: "#1a1f31" },
        },

        indigo: {
          50: { value: "#d4d8edff" },
          100: { value: "#C5CAE9" },
          200: { value: "#9FA8DA" },
          300: { value: "#8593d9" },
          400: { value: "#5C6BC0" },
          500: { value: "#3F51B5" },
          600: { value: "#3949AB" },
          700: { value: "#303F9F" },
          800: { value: "#242a4c" },
          900: { value: "#232948" },
          950: { value: "#1c2034" },
        },

        discord: {
          50: { value: "#e3e6faff" },
          100: { value: "#D0D6FA" },
          200: { value: "#B3BCF7" },
          300: { value: "#96A3F4" },
          400: { value: "#7989F1" },
          500: { value: "#5865F2" },
          600: { value: "#4A55D2" },
          700: { value: "#3C46B2" },
          800: { value: "#313557" },
          900: { value: "#282c53" },
          950: { value: "#1d2036" },
        },

        powderLavender: {
          50: { value: "#e4e4f6ff" },
          100: { value: "#E2E1FF" },
          200: { value: "#CECDFF" },
          300: { value: "#BAB8FF" },
          400: { value: "#A6A3FF" },
          500: { value: "#8E8CD8" },
          600: { value: "#7A78C2" },
          700: { value: "#6361A3" },
          800: { value: "#353550" },
          900: { value: "#33334b" },
          950: { value: "#252535" },
        },

        lavender: {
          50: { value: "#ede5fd" },
          100: { value: "#e2d6fc" },
          200: { value: "#CBB3FF" },
          300: { value: "#AF8DFF" },
          400: { value: "#9567FF" },
          500: { value: "#7A42FF" },
          600: { value: "#6720E6" },
          700: { value: "#5314B3" },
          800: { value: "#312a43" },
          900: { value: "#332948" },
          950: { value: "#231d30" },
        },

        purple: {
          50: { value: "#faf5ff" },
          100: { value: "#f3e8ff" },
          200: { value: "#e9d5ff" },
          300: { value: "#d8b4fe" },
          400: { value: "#c084fc" },
          500: { value: "#a855f7" },
          600: { value: "#9333ea" },
          700: { value: "#641ba3" },
          800: { value: "#3e2953" },
          900: { value: "#3c294f" },
          950: { value: "#291e33" },
        },

        bubblegumPink: {
          50: { value: "#fbe4f3ff" },
          100: { value: "#FFD9F2" },
          200: { value: "#FFB6E4" },
          300: { value: "#FF92D7" },
          400: { value: "#FF6EC9" },
          500: { value: "#FF4ABB" },
          600: { value: "#E642A8" },
          700: { value: "#B33283" },
          800: { value: "#5b2e4a" },
          900: { value: "#4d273f" },
          950: { value: "#341f2c" },
        },

        pink: {
          50: { value: "#fdf2f8" },
          100: { value: "#fce7f3" },
          200: { value: "#fbcfe8" },
          300: { value: "#f9a8d4" },
          400: { value: "#f472b6" },
          500: { value: "#ec4899" },
          600: { value: "#db2777" },
          700: { value: "#a41752" },
          800: { value: "#682747" },
          900: { value: "#402431" },
          950: { value: "#2f1c25" },
        },
      },
      gradients: {},

      sizes: {},
      spacing: {},

      fonts: {
        heading: { value: "'Wix Madefor Text Variable', sans-serif" },
        body: { value: "'Wix Madefor Text Variable', sans-serif" },
        number: { value: "'Wix Madefor Text Variable', sans-serif" },

        jakarta: { value: "'Plus Jakarta Sans Variable', sans-serif" },
      },
      fontSizes: {
        // xs: { value: "0.75rem" }, // 12px
        // sm: { value: "0.8125rem" }, // 13px
        // md: { value: "0.875rem" }, // 14px
        // lg: { value: "1rem" }, // 16px
        // xl: { value: "1.125rem" }, // 18px
        // "2xl": { value: "1.3125rem" }, // 21px
        // "3xl": { value: "1.625rem" }, // 26px
        // "4xl": { value: "2rem" }, // 32px
        // "5xl": { value: "2.5rem" }, // 40px
        // "6xl": { value: "3.125rem" }, // 50px
        // "7xl": { value: "3.9375rem" }, // 63px
        // "8xl": { value: "5rem" }, // 80px
        // "9xl": { value: "6.3125rem" }, // 101px
        xs: { value: "0.6875rem" }, // 11px
        sm: { value: "0.8125rem" }, // 13px
        md: { value: "0.9375rem" }, // 15px
        lg: { value: "1.0625rem" }, // 17px
        xl: { value: "1.1875rem" }, // 19px
        "2xl": { value: "1.4375rem" }, // 23px
        "3xl": { value: "1.8125rem" }, // 29px
        "4xl": { value: "2.1875rem" }, // 35px
        "5xl": { value: "2.9375rem" }, // 47px
        "6xl": { value: "3.6875rem" }, // 59px
        "7xl": { value: "4.4375rem" }, // 71px
        "8xl": { value: "5.9375rem" }, // 95px
        "9xl": { value: "7.9375rem" }, // 127px
      },
      fontWeights: {
        normal: { value: "500" },
        medium: { value: "550" },
        semibold: { value: "600" },
        bold: { value: "700" },
        extrabold: { value: "800" },
        black: { value: "900" },
      },
      letterSpacings: {},
      lineHeights: {},

      radii: {},

      borders: {},
      borderWidths: {},

      shadows: {},

      easings: {},

      opacity: {},

      zIndex: {},

      assets: {},

      durations: {
        fastest: {
          value: "50ms",
        },
        faster: {
          value: "100ms",
        },
        fast: {
          value: "150ms",
        },
        moderate: {
          value: "200ms",
        },
        slow: {
          value: "300ms",
        },
        slower: {
          value: "450ms",
        },
        slowest: {
          value: "550ms",
        },
      },

      // Motion preset
      animations: {
        "scale-up-overshoot-from-click-origin": {
          value: "scale-up-overshoot-from-click-origin",
        },
        "scale-up": {
          value: "scale-up cubic-bezier(0.4, 0, 0.2, 1)",
        },
        "scale-up-overshoot": {
          value: "scale-up-overshoot cubic-bezier(0.4, 0, 0.2, 1)",
        },
        "scale-down": {
          value: "scale-down cubic-bezier(0.4, 0, 0.2, 1)",
        },
        "shrink-x": {
          value: "shrink-x",
        },
      },

      aspectRatios: {},
    },

    semanticTokens: {
      colors: {
        bg: {
          subtle: {
            value: {
              base: "{colors.neutral.50} !important",
              _dark: "{colors.neutral.950} !important",
            },
          },
          muted: {
            value: {
              base: "{colors.neutral.100} !important",
              _dark: "{colors.neutral.900} !important",
            },
          },
          emphasized: {
            value: {
              base: "{colors.neutral.200} !important",
              _dark: "{colors.neutral.800} !important",
            },
          },
          canvas: {
            value: {
              base: "{colors.canvasLight}",
              _dark: "{colors.canvasDark}",
            },
          },
          body: {
            value: {
              base: "{colors.bodyLight}",
              _dark: "{colors.bodyDark}",
            },
          },
          inverted: {
            value: {
              base: "{colors.bodyDark}",
              _dark: "{colors.bodyLight}",
            },
          },
          frosted: {
            value: {
              base: "rgba(250, 249, 255, 0.5)",
              _dark: "rgba(40, 40, 40, 0.5)",
            },
          },
          backdrop: {
            value: {
              base: "{colors.blackAlpha.500}",
              _dark: "{colors.blackAlpha.500}",
            },
          },
        },

        border: {
          DEFAULT: {
            value: {
              base: "{colors.neutral.200} !important",
              _dark: "{colors.neutral.800} !important",
            },
          },
          subtle: {
            value: {
              base: "{colors.an1} !important",
              _dark: "{colors.an1} !important",
            },
          },
          muted: {
            value: {
              base: "{colors.an2} !important",
              _dark: "{colors.an2} !important",
            },
          },
          emphasized: {
            value: {
              base: "{colors.an3} !important",
              _dark: "{colors.an3} !important",
            },
          },
        },

        neutral: {
          contrast: {
            value: {
              base: "{colors.bodyLight}",
              _dark: "{colors.bodyDark}",
            },
          },
          fg: {
            value: {
              base: "{colors.neutral.800}",
              _dark: "{colors.neutral.200}",
            },
          },
          subtle: {
            value: {
              base: "{colors.neutral.100}",
              _dark: "{colors.neutral.900}",
            },
          },
          muted: {
            value: {
              base: "{colors.neutral.200}",
              _dark: "{colors.neutral.800}",
            },
          },
          emphasized: {
            value: {
              base: "{colors.neutral.300}",
              _dark: "{colors.neutral.700}",
            },
          },
          solid: {
            value: {
              base: "{colors.bodyDark}",
              _dark: "{colors.bodyLight}",
            },
          },
          focusRing: {
            value: {
              base: "{colors.neutral.500}",
              _dark: "{colors.neutral.700}",
            },
          },
          border: {
            value: {
              base: "{colors.neutral.200}",
              _dark: "{colors.neutral.800}",
            },
          },
        },

        // slight blue tint gray
        grey: {
          contrast: {
            value: {
              base: "{colors.grey.50}",
              _dark: "{colors.grey.100}",
            },
          },
          fg: {
            value: {
              base: "{colors.grey.600}",
              _dark: "{colors.grey.200}",
            },
          },
          subtle: {
            value: {
              base: "{colors.grey.50}",
              _dark: "{colors.grey.950}",
            },
          },
          muted: {
            value: {
              base: "{colors.grey.100}",
              _dark: "{colors.grey.900}",
            },
          },
          emphasized: {
            value: {
              base: "{colors.grey.200}",
              _dark: "{colors.grey.800}",
            },
          },
          solid: {
            value: {
              base: "{colors.grey.500}",
              _dark: "{colors.grey.700}",
            },
          },
          focusRing: {
            value: {
              base: "{colors.grey.500}",
              _dark: "{colors.grey.700}",
            },
          },
          border: {
            value: {
              base: "{colors.grey.200}",
              _dark: "{colors.grey.800}",
            },
          },
        },

        cream: {
          contrast: {
            value: {
              base: "{colors.cream.50}",
              _dark: "{colors.cream.100}",
            },
          },
          fg: {
            value: {
              base: "{colors.cream.600}",
              _dark: "{colors.cream.200}",
            },
          },
          subtle: {
            value: {
              base: "{colors.cream.50}",
              _dark: "{colors.cream.950}",
            },
          },
          muted: {
            value: {
              base: "{colors.cream.100}",
              _dark: "{colors.cream.900}",
            },
          },
          emphasized: {
            value: {
              base: "{colors.cream.200}",
              _dark: "{colors.cream.800}",
            },
          },
          solid: {
            value: {
              base: "{colors.cream.500}",
              _dark: "{colors.cream.700}",
            },
          },
          focusRing: {
            value: {
              base: "{colors.cream.500}",
              _dark: "{colors.cream.700}",
            },
          },
          border: {
            value: {
              base: "{colors.cream.200}",
              _dark: "{colors.cream.800}",
            },
          },
        },

        caramel: {
          contrast: {
            value: {
              base: "{colors.caramel.50}",
              _dark: "{colors.caramel.100}",
            },
          },
          fg: {
            value: {
              base: "{colors.caramel.500}",
              _dark: "{colors.caramel.200}",
            },
          },
          subtle: {
            value: {
              base: "{colors.caramel.50}",
              _dark: "{colors.caramel.950}",
            },
          },
          muted: {
            value: {
              base: "{colors.caramel.100}",
              _dark: "{colors.caramel.900}",
            },
          },
          emphasized: {
            value: {
              base: "{colors.caramel.200}",
              _dark: "{colors.caramel.800}",
            },
          },
          solid: {
            value: {
              base: "{colors.caramel.500}",
              _dark: "{colors.caramel.700}",
            },
          },
          focusRing: {
            value: {
              base: "{colors.caramel.500}",
              _dark: "{colors.caramel.700}",
            },
          },
          border: {
            value: {
              base: "{colors.caramel.200}",
              _dark: "{colors.caramel.800}",
            },
          },
        },

        mocha: {
          contrast: {
            value: { base: "{colors.mocha.50}", _dark: "{colors.mocha.100}" },
          },
          fg: {
            value: {
              base: "{colors.mocha.500}",
              _dark: "{colors.mocha.200}",
            },
          },
          subtle: {
            value: {
              base: "{colors.mocha.50}",
              _dark: "{colors.mocha.950}",
            },
          },
          muted: {
            value: {
              base: "{colors.mocha.100}",
              _dark: "{colors.mocha.900}",
            },
          },
          emphasized: {
            value: {
              base: "{colors.mocha.200}",
              _dark: "{colors.mocha.800}",
            },
          },
          solid: {
            value: {
              base: "{colors.mocha.500}",
              _dark: "{colors.mocha.700}",
            },
          },
          focusRing: {
            value: {
              base: "{colors.mocha.500}",
              _dark: "{colors.mocha.700}",
            },
          },
          border: {
            value: {
              base: "{colors.mocha.200}",
              _dark: "{colors.mocha.800}",
            },
          },
        },

        brown: {
          contrast: {
            value: { base: "{colors.brown.50}", _dark: "{colors.brown.100}" },
          },
          fg: {
            value: {
              base: "{colors.brown.500}",
              _dark: "{colors.brown.200}",
            },
          },
          subtle: {
            value: {
              base: "{colors.brown.50}",
              _dark: "{colors.brown.950}",
            },
          },
          muted: {
            value: {
              base: "{colors.brown.100}",
              _dark: "{colors.brown.900}",
            },
          },
          emphasized: {
            value: {
              base: "{colors.brown.200}",
              _dark: "{colors.brown.800}",
            },
          },
          solid: {
            value: {
              base: "{colors.brown.500}",
              _dark: "{colors.brown.700}",
            },
          },
          focusRing: {
            value: {
              base: "{colors.brown.500}",
              _dark: "{colors.brown.700}",
            },
          },
          border: {
            value: {
              base: "{colors.brown.200}",
              _dark: "{colors.brown.800}",
            },
          },
        },

        maroon: {
          contrast: {
            value: {
              base: "{colors.maroon.50}",
              _dark: "{colors.maroon.100}",
            },
          },
          fg: {
            value: {
              base: "{colors.maroon.500}",
              _dark: "{colors.maroon.200}",
            },
          },
          subtle: {
            value: {
              base: "{colors.maroon.50}",
              _dark: "{colors.maroon.950}",
            },
          },
          muted: {
            value: {
              base: "{colors.maroon.100}",
              _dark: "{colors.maroon.900}",
            },
          },
          emphasized: {
            value: {
              base: "{colors.maroon.200}",
              _dark: "{colors.maroon.800}",
            },
          },
          solid: {
            value: {
              base: "{colors.maroon.500}",
              _dark: "{colors.maroon.500}",
            },
          },
          focusRing: {
            value: {
              base: "{colors.maroon.500}",
              _dark: "{colors.maroon.700}",
            },
          },
          border: {
            value: {
              base: "{colors.maroon.200}",
              _dark: "{colors.maroon.800}",
            },
          },
        },

        red: {
          contrast: {
            value: {
              base: "{colors.red.50}",
              _dark: "{colors.red.100}",
            },
          },
          fg: {
            value: {
              base: "{colors.red.500}",
              _dark: "{colors.red.300}",
            },
          },
          subtle: {
            value: {
              base: "{colors.red.50} !important",
              _dark: "{colors.red.950} !important",
            },
          },
          muted: {
            value: {
              base: "{colors.red.100} !important",
              _dark: "{colors.red.900} !important",
            },
          },
          emphasized: {
            value: {
              base: "{colors.red.200} !important",
              _dark: "{colors.red.800} !important",
            },
          },
          solid: {
            value: {
              base: "{colors.red.500}",
              _dark: "{colors.red.500}",
            },
          },
          focusRing: {
            value: {
              base: "{colors.red.500}",
              _dark: "{colors.red.700}",
            },
          },
          border: {
            value: {
              base: "{colors.red.200} !important",
              _dark: "{colors.red.800} !important",
            },
          },
        },

        salmon: {
          contrast: {
            value: {
              base: "{colors.salmon.50}",
              _dark: "{colors.salmon.100}",
            },
          },
          fg: {
            value: {
              base: "{colors.salmon.500}",
              _dark: "{colors.salmon.200}",
            },
          },
          subtle: {
            value: {
              base: "{colors.salmon.50}",
              _dark: "{colors.salmon.950}",
            },
          },
          muted: {
            value: {
              base: "{colors.salmon.100}",
              _dark: "{colors.salmon.900}",
            },
          },
          emphasized: {
            value: {
              base: "{colors.salmon.200}",
              _dark: "{colors.salmon.800}",
            },
          },
          solid: {
            value: {
              base: "{colors.salmon.500}",
              _dark: "{colors.salmon.700}",
            },
          },
          focusRing: {
            value: {
              base: "{colors.salmon.500}",
              _dark: "{colors.salmon.700}",
            },
          },
          border: {
            value: {
              base: "{colors.salmon.200}",
              _dark: "{colors.salmon.800}",
            },
          },
        },

        pastelOrange: {
          contrast: {
            value: {
              base: "{colors.pastelOrange.50}",
              _dark: "{colors.pastelOrange.100}",
            },
          },
          fg: {
            value: {
              base: "{colors.pastelOrange.600}",
              _dark: "{colors.pastelOrange.400}",
            },
          },
          subtle: {
            value: {
              base: "{colors.pastelOrange.50}",
              _dark: "{colors.pastelOrange.950}",
            },
          },
          muted: {
            value: {
              base: "{colors.pastelOrange.100}",
              _dark: "{colors.pastelOrange.900}",
            },
          },
          emphasized: {
            value: {
              base: "{colors.pastelOrange.200}",
              _dark: "{colors.pastelOrange.800}",
            },
          },
          solid: {
            value: {
              base: "{colors.pastelOrange.500}",
              _dark: "{colors.pastelOrange.700}",
            },
          },
          focusRing: {
            value: {
              base: "{colors.pastelOrange.500}",
              _dark: "{colors.pastelOrange.700}",
            },
          },
          border: {
            value: {
              base: "{colors.pastelOrange.200}",
              _dark: "{colors.pastelOrange.800}",
            },
          },
        },

        orange: {
          contrast: {
            value: {
              base: "{colors.orange.50} !important",
              _dark: "{colors.orange.100} !important",
            },
          },
          fg: {
            value: {
              base: "{colors.orange.500} !important",
              _dark: "{colors.orange.400} !important",
            },
          },
          subtle: {
            value: {
              base: "{colors.orange.50} !important",
              _dark: "{colors.orange.950} !important",
            },
          },
          muted: {
            value: {
              base: "{colors.orange.100} !important",
              _dark: "{colors.orange.900} !important",
            },
          },
          emphasized: {
            value: {
              base: "{colors.orange.200} !important",
              _dark: "{colors.orange.800} !important",
            },
          },
          solid: {
            value: {
              base: "{colors.orange.500} !important",
              _dark: "{colors.orange.700} !important",
            },
          },
          focusRing: {
            value: {
              base: "{colors.orange.500}",
              _dark: "{colors.orange.700}",
            },
          },
          border: {
            value: {
              base: "{colors.orange.200} !important",
              _dark: "{colors.orange.800} !important",
            },
          },
        },

        gold: {
          contrast: {
            value: {
              base: "{colors.gold.50}",
              _dark: "{colors.gold.900}",
            },
          },
          fg: {
            value: {
              base: "{colors.gold.500}",
              _dark: "{colors.gold.500}",
            },
          },
          subtle: {
            value: {
              base: "{colors.gold.50}",
              _dark: "{colors.gold.950}",
            },
          },
          muted: {
            value: {
              base: "{colors.gold.100}",
              _dark: "{colors.gold.900}",
            },
          },
          emphasized: {
            value: {
              base: "{colors.gold.200}",
              _dark: "{colors.gold.800}",
            },
          },
          solid: {
            value: {
              base: "{colors.gold.500}",
              _dark: "{colors.gold.500}",
            },
          },
          focusRing: {
            value: {
              base: "{colors.gold.500}",
              _dark: "{colors.gold.700}",
            },
          },
          border: {
            value: {
              base: "{colors.gold.200} !important",
              _dark: "{colors.gold.800} !important",
            },
          },
        },

        yellow: {
          contrast: {
            value: {
              base: "{colors.yellow.900} !important",
              _dark: "{colors.yellow.950} !important",
            },
          },
          fg: {
            value: {
              base: "{colors.yellow.600} !important",
              _dark: "{colors.yellow.500} !important",
            },
          },
          subtle: {
            value: {
              base: "{colors.yellow.50} !important",
              _dark: "{colors.yellow.950} !important",
            },
          },
          muted: {
            value: {
              base: "{colors.yellow.100} !important",
              _dark: "{colors.yellow.900} !important",
            },
          },
          emphasized: {
            value: {
              base: "{colors.yellow.200} !important",
              _dark: "{colors.yellow.800} !important",
            },
          },
          solid: {
            value: {
              base: "{colors.yellow.500}",
              _dark: "{colors.yellow.500}",
            },
          },
          focusRing: {
            value: {
              base: "{colors.yellow.500}",
              _dark: "{colors.yellow.700}",
            },
          },
          border: {
            value: {
              base: "{colors.yellow.200} !important",
              _dark: "{colors.yellow.800} !important",
            },
          },
        },

        lime: {
          contrast: {
            value: {
              base: "{colors.lime.800}",
              _dark: "{colors.lime.950}",
            },
          },
          fg: {
            value: {
              base: "{colors.lime.700}",
              _dark: "{colors.lime.300}",
            },
          },
          subtle: {
            value: {
              base: "{colors.lime.50}",
              _dark: "{colors.lime.950}",
            },
          },
          muted: {
            value: {
              base: "{colors.lime.100}",
              _dark: "{colors.lime.900}",
            },
          },
          emphasized: {
            value: {
              base: "{colors.lime.200}",
              _dark: "{colors.lime.800}",
            },
          },
          solid: {
            value: {
              base: "{colors.lime.500}",
              _dark: "{colors.lime.600}",
            },
          },
          focusRing: {
            value: {
              base: "{colors.lime.500}",
              _dark: "{colors.lime.700}",
            },
          },
          border: {
            value: {
              base: "{colors.lime.200}",
              _dark: "{colors.lime.800}",
            },
          },
        },

        olive: {
          contrast: {
            value: {
              base: "{colors.olive.50}",
              _dark: "{colors.olive.50}",
            },
          },
          fg: {
            value: {
              base: "{colors.olive.700}",
              _dark: "{colors.olive.300}",
            },
          },
          subtle: {
            value: {
              base: "{colors.olive.50}",
              _dark: "{colors.olive.950}",
            },
          },
          muted: {
            value: {
              base: "{colors.olive.100}",
              _dark: "{colors.olive.900}",
            },
          },
          emphasized: {
            value: {
              base: "{colors.olive.200}",
              _dark: "{colors.olive.800}",
            },
          },
          solid: {
            value: {
              base: "{colors.olive.500}",
              _dark: "{colors.olive.600}",
            },
          },
          focusRing: {
            value: {
              base: "{colors.olive.500}",
              _dark: "{colors.olive.700}",
            },
          },
          border: {
            value: {
              base: "{colors.olive.200}",
              _dark: "{colors.olive.800}",
            },
          },
        },

        green: {
          contrast: {
            value: {
              base: "{colors.green.50} !important",
              _dark: "{colors.green.950} !important",
            },
          },
          fg: {
            value: {
              base: "{colors.green.600} !important",
              _dark: "{colors.green.300} !important",
            },
          },
          subtle: {
            value: {
              base: "{colors.green.50} !important",
              _dark: "{colors.green.950} !important",
            },
          },
          muted: {
            value: {
              base: "{colors.green.100} !important",
              _dark: "{colors.green.900} !important",
            },
          },
          emphasized: {
            value: {
              base: "{colors.green.200} !important",
              _dark: "{colors.green.800} !important",
            },
          },
          solid: {
            value: {
              base: "{colors.green.500}",
              _dark: "{colors.green.600}",
            },
          },
          focusRing: {
            value: {
              base: "{colors.green.500}",
              _dark: "{colors.green.500}",
            },
          },
          border: {
            value: {
              base: "{colors.green.200} !important",
              _dark: "{colors.green.800} !important",
            },
          },
        },

        jade: {
          contrast: {
            value: {
              base: "{colors.jade.50}",
              _dark: "{colors.jade.950}",
            },
          },
          fg: {
            value: {
              base: "{colors.jade.600}",
              _dark: "{colors.jade.300}",
            },
          },
          subtle: {
            value: {
              base: "{colors.jade.50}",
              _dark: "{colors.jade.950}",
            },
          },
          muted: {
            value: {
              base: "{colors.jade.100}",
              _dark: "{colors.jade.900}",
            },
          },
          emphasized: {
            value: {
              base: "{colors.jade.200}",
              _dark: "{colors.jade.800}",
            },
          },
          solid: {
            value: {
              base: "{colors.jade.500}",
              _dark: "{colors.jade.500}",
            },
          },
          focusRing: {
            value: {
              base: "{colors.jade.500}",
              _dark: "{colors.jade.500}",
            },
          },
          border: {
            value: {
              base: "{colors.jade.200}",
              _dark: "{colors.jade.800}",
            },
          },
        },

        teal: {
          contrast: {
            value: {
              base: "{colors.teal.50} !important",
              _dark: "{colors.teal.950} !important",
            },
          },
          fg: {
            value: {
              base: "{colors.teal.600} !important",
              _dark: "{colors.teal.300} !important",
            },
          },
          subtle: {
            value: {
              base: "{colors.teal.50} !important",
              _dark: "{colors.teal.950} !important",
            },
          },
          muted: {
            value: {
              base: "{colors.teal.100} !important",
              _dark: "{colors.teal.900} !important",
            },
          },
          emphasized: {
            value: {
              base: "{colors.teal.200} !important",
              _dark: "{colors.teal.800} !important",
            },
          },
          solid: {
            value: {
              base: "{colors.teal.500} !important",
              _dark: "{colors.teal.500} !important",
            },
          },
          focusRing: {
            value: {
              base: "{colors.teal.500}",
              _dark: "{colors.teal.500}",
            },
          },
          border: {
            value: {
              base: "{colors.teal.200} !important",
              _dark: "{colors.teal.800} !important",
            },
          },
        },

        tealBlue: {
          contrast: {
            value: {
              base: "{colors.tealBlue.50}",
              _dark: "{colors.tealBlue.950}",
            },
          },
          fg: {
            value: {
              base: "{colors.tealBlue.600}",
              _dark: "{colors.tealBlue.400}",
            },
          },
          subtle: {
            value: {
              base: "{colors.tealBlue.50}",
              _dark: "{colors.tealBlue.950}",
            },
          },
          muted: {
            value: {
              base: "{colors.tealBlue.100}",
              _dark: "{colors.tealBlue.900}",
            },
          },
          emphasized: {
            value: {
              base: "{colors.tealBlue.200}",
              _dark: "{colors.tealBlue.800}",
            },
          },
          solid: {
            value: {
              base: "{colors.tealBlue.500}",
              _dark: "{colors.tealBlue.500}",
            },
          },
          focusRing: {
            value: {
              base: "{colors.tealBlue.500}",
              _dark: "{colors.tealBlue.500}",
            },
          },
          border: {
            value: {
              base: "{colors.tealBlue.200}",
              _dark: "{colors.tealBlue.800}",
            },
          },
        },

        cyan: {
          contrast: {
            value: {
              base: "{colors.cyan.50} !important",
              _dark: "{colors.cyan.950} !important",
            },
          },
          fg: {
            value: {
              base: "{colors.cyan.600} !important",
              _dark: "{colors.cyan.400} !important",
            },
          },
          subtle: {
            value: {
              base: "{colors.cyan.50} !important",
              _dark: "{colors.cyan.950} !important",
            },
          },
          muted: {
            value: {
              base: "{colors.cyan.100} !important",
              _dark: "{colors.cyan.900} !important",
            },
          },
          emphasized: {
            value: {
              base: "{colors.cyan.200} !important",
              _dark: "{colors.cyan.800} !important",
            },
          },
          solid: {
            value: {
              base: "{colors.cyan.500} !important",
              _dark: "{colors.cyan.500} !important",
            },
          },
          focusRing: {
            value: {
              base: "{colors.cyan.500}",
              _dark: "{colors.cyan.500}",
            },
          },
          border: {
            value: {
              base: "{colors.cyan.200} !important",
              _dark: "{colors.cyan.800} !important",
            },
          },
        },

        sky: {
          contrast: {
            value: { base: "{colors.sky.50}", _dark: "{colors.sky.900}" },
          },
          fg: {
            value: {
              base: "{colors.sky.500}",
              _dark: "{colors.sky.400}",
            },
          },
          subtle: {
            value: {
              base: "{colors.sky.50}",
              _dark: "{colors.sky.950}",
            },
          },
          muted: {
            value: {
              base: "{colors.sky.100}",
              _dark: "{colors.sky.900}",
            },
          },
          emphasized: {
            value: {
              base: "{colors.sky.200}",
              _dark: "{colors.sky.800}",
            },
          },
          solid: {
            value: {
              base: "{colors.sky.500}",
              _dark: "{colors.sky.500}",
            },
          },
          focusRing: {
            value: {
              base: "{colors.sky.500}",
              _dark: "{colors.sky.700}",
            },
          },
          border: {
            value: {
              base: "{colors.sky.200}",
              _dark: "{colors.sky.800}",
            },
          },
        },

        powderBlue: {
          contrast: {
            value: {
              base: "{colors.powderBlue.50}",
              _dark: "{colors.powderBlue.900}",
            },
          },
          fg: {
            value: {
              base: "{colors.powderBlue.500}",
              _dark: "{colors.powderBlue.400}",
            },
          },
          subtle: {
            value: {
              base: "{colors.powderBlue.50}",
              _dark: "{colors.powderBlue.950}",
            },
          },
          muted: {
            value: {
              base: "{colors.powderBlue.100}",
              _dark: "{colors.powderBlue.900}",
            },
          },
          emphasized: {
            value: {
              base: "{colors.powderBlue.200}",
              _dark: "{colors.powderBlue.800}",
            },
          },
          solid: {
            value: {
              base: "{colors.powderBlue.500}",
              _dark: "{colors.powderBlue.500}",
            },
          },
          focusRing: {
            value: {
              base: "{colors.powderBlue.500}",
              _dark: "{colors.powderBlue.700}",
            },
          },
          border: {
            value: {
              base: "{colors.powderBlue.200}",
              _dark: "{colors.powderBlue.800}",
            },
          },
        },

        blue: {
          contrast: {
            value: {
              base: "{colors.blue.50} !important",
              _dark: "{colors.blue.50} !important",
            },
          },
          fg: {
            value: {
              base: "{colors.blue.500} !important",
              _dark: "{colors.blue.400} !important",
            },
          },
          subtle: {
            value: {
              base: "{colors.blue.50} !important",
              _dark: "{colors.blue.950} !important",
            },
          },
          muted: {
            value: {
              base: "{colors.blue.100} !important",
              _dark: "{colors.blue.900} !important",
            },
          },
          emphasized: {
            value: {
              base: "{colors.blue.200} !important",
              _dark: "{colors.blue.800} !important",
            },
          },
          solid: {
            value: {
              base: "{colors.blue.500} !important",
              _dark: "{colors.blue.600} !important",
            },
          },
          focusRing: {
            value: {
              base: "{colors.blue.500} !important",
              _dark: "{colors.blue.500} !important",
            },
          },
          border: {
            value: {
              base: "{colors.blue.200} !important",
              _dark: "{colors.blue.800} !important",
            },
          },
        },

        sapphire: {
          contrast: {
            value: {
              base: "{colors.sapphire.100}",
              _dark: "{colors.sapphire.100}",
            },
          },
          fg: {
            value: {
              base: "{colors.sapphire.500}",
              _dark: "{colors.sapphire.300}",
            },
          },
          subtle: {
            value: {
              base: "{colors.sapphire.50}",
              _dark: "{colors.sapphire.950}",
            },
          },
          muted: {
            value: {
              base: "{colors.sapphire.100}",
              _dark: "{colors.sapphire.900}",
            },
          },
          emphasized: {
            value: {
              base: "{colors.sapphire.200}",
              _dark: "{colors.sapphire.800}",
            },
          },
          solid: {
            value: {
              base: "{colors.sapphire.500}",
              _dark: "{colors.sapphire.600}",
            },
          },
          focusRing: {
            value: {
              base: "{colors.sapphire.500}",
              _dark: "{colors.sapphire.700}",
            },
          },
          border: {
            value: {
              base: "{colors.sapphire.200}",
              _dark: "{colors.sapphire.800}",
            },
          },
        },

        indigo: {
          contrast: {
            value: { base: "{colors.indigo.50}", _dark: "{colors.indigo.50}" },
          },
          fg: {
            value: {
              base: "{colors.indigo.500}",
              _dark: "{colors.indigo.300}",
            },
          },
          subtle: {
            value: {
              base: "{colors.indigo.50}",
              _dark: "{colors.indigo.950}",
            },
          },
          muted: {
            value: {
              base: "{colors.indigo.100}",
              _dark: "{colors.indigo.900}",
            },
          },
          emphasized: {
            value: {
              base: "{colors.indigo.200}",
              _dark: "{colors.indigo.800}",
            },
          },
          solid: {
            value: {
              base: "{colors.indigo.500}",
              _dark: "{colors.indigo.500}",
            },
          },
          focusRing: {
            value: {
              base: "{colors.indigo.500}",
              _dark: "{colors.indigo.700}",
            },
          },
          border: {
            value: {
              base: "{colors.indigo.200}",
              _dark: "{colors.indigo.800}",
            },
          },
        },

        discord: {
          contrast: {
            value: {
              base: "{colors.discord.50}",
              _dark: "{colors.discord.100}",
            },
          },
          fg: {
            value: {
              base: "{colors.discord.500}",
              _dark: "{colors.discord.300}",
            },
          },
          subtle: {
            value: {
              base: "{colors.discord.50}",
              _dark: "{colors.discord.950}",
            },
          },
          muted: {
            value: {
              base: "{colors.discord.100}",
              _dark: "{colors.discord.900}",
            },
          },
          emphasized: {
            value: {
              base: "{colors.discord.200}",
              _dark: "{colors.discord.800}",
            },
          },
          solid: {
            value: {
              base: "{colors.discord.500}",
              _dark: "{colors.discord.500}",
            },
          },
          focusRing: {
            value: {
              base: "{colors.discord.500}",
              _dark: "{colors.discord.700}",
            },
          },
          border: {
            value: {
              base: "{colors.discord.200}",
              _dark: "{colors.discord.800}",
            },
          },
        },

        powderLavender: {
          contrast: {
            value: {
              base: "{colors.powderLavender.50}",
              _dark: "{colors.powderLavender.900}",
            },
          },
          fg: {
            value: {
              base: "{colors.powderLavender.600}",
              _dark: "{colors.powderLavender.400}",
            },
          },
          subtle: {
            value: {
              base: "{colors.powderLavender.50}",
              _dark: "{colors.powderLavender.950}",
            },
          },
          muted: {
            value: {
              base: "{colors.powderLavender.100}",
              _dark: "{colors.powderLavender.900}",
            },
          },
          emphasized: {
            value: {
              base: "{colors.powderLavender.200}",
              _dark: "{colors.powderLavender.800}",
            },
          },
          solid: {
            value: {
              base: "{colors.powderLavender.500}",
              _dark: "{colors.powderLavender.500}",
            },
          },
          focusRing: {
            value: {
              base: "{colors.powderLavender.500}",
              _dark: "{colors.powderLavender.700}",
            },
          },
          border: {
            value: {
              base: "{colors.powderLavender.200}",
              _dark: "{colors.powderLavender.800}",
            },
          },
        },

        lavender: {
          contrast: {
            value: {
              base: "{colors.lavender.50}",
              _dark: "{colors.lavender.100}",
            },
          },
          fg: {
            value: {
              base: "{colors.lavender.500}",
              _dark: "{colors.lavender.300}",
            },
          },
          subtle: {
            value: {
              base: "{colors.lavender.50}",
              _dark: "{colors.lavender.950}",
            },
          },
          muted: {
            value: {
              base: "{colors.lavender.100}",
              _dark: "{colors.lavender.900}",
            },
          },
          emphasized: {
            value: {
              base: "{colors.lavender.200}",
              _dark: "{colors.lavender.800}",
            },
          },
          solid: {
            value: {
              base: "{colors.lavender.500}",
              _dark: "{colors.lavender.600}",
            },
          },
          focusRing: {
            value: {
              base: "{colors.lavender.500}",
              _dark: "{colors.lavender.700}",
            },
          },
          border: {
            value: {
              base: "{colors.lavender.200}",
              _dark: "{colors.lavender.800}",
            },
          },
        },

        purple: {
          contrast: {
            value: {
              base: "{colors.purple.50} !important",
              _dark: "{colors.purple.950} !important",
            },
          },
          fg: {
            value: {
              base: "{colors.purple.500}",
              _dark: "{colors.purple.400}",
            },
          },
          subtle: {
            value: {
              base: "{colors.purple.50}",
              _dark: "{colors.purple.950}",
            },
          },
          muted: {
            value: {
              base: "{colors.purple.100}",
              _dark: "{colors.purple.900}",
            },
          },
          emphasized: {
            value: {
              base: "{colors.purple.200}",
              _dark: "{colors.purple.800}",
            },
          },
          solid: {
            value: {
              base: "{colors.purple.500}",
              _dark: "{colors.purple.600}",
            },
          },
          focusRing: {
            value: {
              base: "{colors.purple.500}",
              _dark: "{colors.purple.700}",
            },
          },
          border: {
            value: {
              base: "{colors.purple.200}",
              _dark: "{colors.purple.800}",
            },
          },
        },

        bubblegumPink: {
          contrast: {
            value: {
              base: "{colors.bubblegumPink.50}",
              _dark: "{colors.bubblegumPink.100}",
            },
          },
          fg: {
            value: {
              base: "{colors.bubblegumPink.500}",
              _dark: "{colors.bubblegumPink.400}",
            },
          },
          subtle: {
            value: {
              base: "{colors.bubblegumPink.50}",
              _dark: "{colors.bubblegumPink.950}",
            },
          },
          muted: {
            value: {
              base: "{colors.bubblegumPink.100}",
              _dark: "{colors.bubblegumPink.900}",
            },
          },
          emphasized: {
            value: {
              base: "{colors.bubblegumPink.200}",
              _dark: "{colors.bubblegumPink.800}",
            },
          },
          solid: {
            value: {
              base: "{colors.bubblegumPink.500}",
              _dark: "{colors.bubblegumPink.600}",
            },
          },
          focusRing: {
            value: {
              base: "{colors.bubblegumPink.500}",
              _dark: "{colors.bubblegumPink.700}",
            },
          },
          border: {
            value: {
              base: "{colors.bubblegumPink.200}",
              _dark: "{colors.bubblegumPink.800}",
            },
          },
        },

        pink: {
          contrast: {
            value: {
              base: "{colors.pink.50} !important",
              _dark: "{colors.pink.950} !important",
            },
          },
          fg: {
            value: {
              base: "{colors.pink.500} !important",
              _dark: "{colors.pink.400} !important",
            },
          },
          subtle: {
            value: {
              base: "{colors.pink.50}",
              _dark: "{colors.pink.950}",
            },
          },
          muted: {
            value: {
              base: "{colors.pink.100} !important",
              _dark: "{colors.pink.900} !important",
            },
          },
          emphasized: {
            value: {
              base: "{colors.pink.200} !important",
              _dark: "{colors.pink.800} !important",
            },
          },
          solid: {
            value: {
              base: "{colors.pink.500}",
              _dark: "{colors.pink.600}",
            },
          },
          focusRing: {
            value: {
              base: "{colors.pink.500}",
              _dark: "{colors.pink.700}",
            },
          },
          border: {
            value: {
              base: "{colors.pink.200} !important",
              _dark: "{colors.pink.800} !important",
            },
          },
        },
      },
      gradients: {},
      shadows: {
        xs: {
          value: {
            base: "-0.5px -0.5px 1px rgba(0,0,0,0.02), 0 1px 1px rgba(0,0,0,0.01) !important",
            _dark:
              "-0.5px -0.5px 1px rgba(0,0,0,0.08), 0 1px 1px rgba(0,0,0,0.07) !important",
          },
        },
        sm: {
          value: {
            base: "-1px -1px 3px rgba(0,0,0,0.035), 0 1.5px 3px rgba(0,0,0,0.025) !important",
            _dark:
              "-1px -1px 3px rgba(0,0,0,0.13), 0 1.5px 3px rgba(0,0,0,0.11) !important",
          },
        },
        md: {
          value: {
            base: "-1.5px -1.5px 5px rgba(0,0,0,0.045), 0 2.5px 5px rgba(0,0,0,0.035) !important",
            _dark:
              "-1.5px -1.5px 5px rgba(0,0,0,0.15), 0 2.5px 5px rgba(0,0,0,0.13) !important",
          },
        },
        lg: {
          value: {
            base: "-2px -2px 8px rgba(0,0,0,0.055), 0 3.5px 7px rgba(0,0,0,0.045) !important",
            _dark:
              "-2px -2px 8px rgba(0,0,0,0.17), 0 3.5px 7px rgba(0,0,0,0.15) !important",
          },
        },
        xl: {
          value: {
            base: "-3px -3px 12px rgba(0,0,0,0.065), 0 5px 10px rgba(0,0,0,0.055) !important",
            _dark:
              "-3px -3px 12px rgba(0,0,0,0.19), 0 5px 10px rgba(0,0,0,0.17) !important",
          },
        },
        "2xl": {
          value: {
            base: "-4px -4px 17px rgba(0,0,0,0.075), 0 7px 14px rgba(0,0,0,0.065) !important",
            _dark:
              "-4px -4px 17px rgba(0,0,0,0.22), 0 7px 14px rgba(0,0,0,0.20) !important",
          },
        },
      },
      radii: {},
      borders: {},
    },

    textStyles: {},

    layerStyles: {},

    animationStyles: {},

    recipes: {
      button: buttonRecipe,
      input: inputRecipe,
    },

    slotRecipes: {
      select: selectRecipe,
      checkbox: checkboxRecipe,
      dialog: dialogRecipe,
      drawer: drawerRecipe,
      carousel: carouselRecipe,
    },
  },
});

export const chakraSystem = createSystem(defaultConfig, chakraConfig);

export default chakraSystem;
