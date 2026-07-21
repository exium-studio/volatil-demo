// src/design-system/constants/styles.ts

import type { ButtonProps } from "@/design-system/components/button/types/button.type";
import type { InputProps } from "@/design-system/components/input/types/input.type";

// Dimensions
export const SM_SCREEN_BREAKPOINT = "720px";
export const MODAL_CONTROL_CONTAINER_W = "70px";
export const HEADER_H = "56px";
export const FEEDBACK_CONTAINER_MIN_H = "250px";

// Layout/Stack
export const MODAL_BASE_ZINDEX = 1400;

// Sizes
export const MAIN_BUTTON_SIZE = ["lg", null, "md"] as ButtonProps["size"];
export const MAIN_INPUT_SIZE = ["lg", null, "md"] as InputProps["size"];

export const LUCIDE_ICON_BASE_ICON_BOX_SIZE = 5;
export const LUCIDE_ICON_MENU_ICON_BOX_SIZE = 4.5;
export const TABLER_ICON_BASE_ICON_BOX_SIZE = 5;
export const TABLER_ICON_MENU_ICON_BOX_SIZE = 4.5;

// Spacing
export const MODAL_CONTROL_CONTAINER_SPACING_R = 1.5;
export const SPACING_SM = "4px";
export const SPACING_MD = "12px";
export const SPACING_LG = "24px";
export const GAP = "6px";
export const SECTION_GAP = 8;

// Padding
export const PADDING_SM = "8px";
export const PADDING_MD = "16px";
export const PADDING_LG = "24px";

// Effect
export const BACKDROP_FILTER_BLUR = "blur(2px)";

// Data Table
export const TABLE_ACTIONS_CELL_W = "56px";
export const TABLE_ROW_H = "56px";
export const TABLE_CELL_H = "56px";
export const TABLE_ROW_GAP = "4px";
