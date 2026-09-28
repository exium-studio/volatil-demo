// src/design-system/components/input/utils/focus-select.util.ts

import type { AppIconProps } from "@/design-system/components/icon/types/app-icon.type";
import type { ButtonProps } from "@/design-system/components/button/types/button.type";

/**
 * Standard Chakra button height mapping by size.
 */
export const BUTTON_SIZE_HEIGHT_MAP: Record<string, number> = {
  "2xs": 24,
  xs: 32,
  sm: 36,
  md: 40,
  lg: 44,
  xl: 48,
  "2xl": 64,
};

/**
 * Height applied to buttons when wrapped in a floating Field.
 */
export const FLOATING_FIELD_BUTTON_HEIGHT = 60;

/**
 * Top offset/padding applied to button content when wrapped in a floating Field.
 */
export const FLOATING_FIELD_TOP_OFFSET = 20;

/**
 * Calculate icon size for action and chevron indicators based on button size.
 */
export function getFocusSelectIconSize(
  size?: ButtonProps["size"],
): AppIconProps["size"] {
  switch (size) {
    case "2xs":
    case "xs":
      return "xs";
    case "sm":
      return "sm";
    case "lg":
    case "xl":
    case "2xl":
      return "md";
    case "md":
    default:
      return "sm";
  }
}

/**
 * Calculate the vertical alignment adjustment for trailing action icons
 * when rendered inside a floating Field vs regular standalone trigger.
 *
 * In floating Field, the label floats at the top (~20px), and content is shifted downwards.
 * Centering horizontally and vertically relative to the input line requires offsetting by `topOffset / 2`.
 */
export function getFocusSelectActionAlignment(isFloatingField: boolean) {
  if (!isFloatingField) {
    return {
      alignSelf: "center" as const,
      transform: undefined,
    };
  }

  // Shift center down by half of the floating label space (20px / 2 = 10px)
  // to align harmoniously with the active value/placeholder text.
  return {
    alignSelf: "center" as const,
    transform: `translateY(${FLOATING_FIELD_TOP_OFFSET / 2}px)`,
  };
}
