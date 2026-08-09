// src/design-system/constants/styles.ts

import type { ButtonProps } from "@/design-system/components/button/types/button.type";
import type { InputProps } from "@/design-system/components/input/types/input.type";

export const STYLE_CONFIG = {
  dimensions: {
    smScreenBreakpoint: "720px",
    modalControlContainerW: "70px",
    headerH: "56px",
    feedbackContainerMinH: "250px",
  },
  modal: {
    baseZIndex: 1400,
    controlContainerSpacingR: 1.5,
    animationDurationMs: 300,
    defaultDialogClickOriginAnimation: false,
  },
  sizes: {
    mainButton: ["lg", null, "md"] as ButtonProps["size"],
    mainInput: ["lg", null, "md"] as InputProps["size"],
  },
  icons: {
    lucideBaseBoxSize: 5,
    lucideMenuBoxSize: 4.5,
    tablerBaseBoxSize: 5,
    tablerMenuBoxSize: 4.5,
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "24px",
    gap: "6px",
    sectionGap: 8,
  },
  padding: {
    sm: "8px",
    md: "16px",
    lg: "22px",
    xl: "28px",
  },
  animation: {
    backdropFilterBlur: "blur(2px)",
  },
  table: {
    actionsCellW: "56px",
    rowH: "56px",
    cellH: "56px",
    rowGap: "4px",
  },
} as const;

// Individual export tokens for backward compatibility
export const SM_SCREEN_BREAKPOINT = STYLE_CONFIG.dimensions.smScreenBreakpoint;
export const MODAL_CONTROL_CONTAINER_W =
  STYLE_CONFIG.dimensions.modalControlContainerW;
export const HEADER_H = STYLE_CONFIG.dimensions.headerH;
export const FEEDBACK_CONTAINER_MIN_H =
  STYLE_CONFIG.dimensions.feedbackContainerMinH;

export const MODAL_BASE_ZINDEX = STYLE_CONFIG.modal.baseZIndex;
export const MODAL_CONTROL_CONTAINER_SPACING_R =
  STYLE_CONFIG.modal.controlContainerSpacingR;
export const MODAL_ANIMATION_DURATION_MS =
  STYLE_CONFIG.modal.animationDurationMs;
export const DEFAULT_DIALOG_CLICK_ORIGIN_ANIMATION =
  STYLE_CONFIG.modal.defaultDialogClickOriginAnimation;

export const MAIN_BUTTON_SIZE = STYLE_CONFIG.sizes.mainButton;
export const MAIN_INPUT_SIZE = STYLE_CONFIG.sizes.mainInput;

export const LUCIDE_ICON_BASE_ICON_BOX_SIZE =
  STYLE_CONFIG.icons.lucideBaseBoxSize;
export const LUCIDE_ICON_MENU_ICON_BOX_SIZE =
  STYLE_CONFIG.icons.lucideMenuBoxSize;
export const TABLER_ICON_BASE_ICON_BOX_SIZE =
  STYLE_CONFIG.icons.tablerBaseBoxSize;
export const TABLER_ICON_MENU_ICON_BOX_SIZE =
  STYLE_CONFIG.icons.tablerMenuBoxSize;

export const SPACING_XS = STYLE_CONFIG.spacing.xs;
export const SPACING_SM = STYLE_CONFIG.spacing.sm;
export const SPACING_MD = STYLE_CONFIG.spacing.md;
export const SPACING_LG = STYLE_CONFIG.spacing.lg;
export const GAP = STYLE_CONFIG.spacing.gap;
export const SECTION_GAP = STYLE_CONFIG.spacing.sectionGap;

export const PADDING_SM = STYLE_CONFIG.padding.sm;
export const PADDING_MD = STYLE_CONFIG.padding.md;
export const PADDING_LG = STYLE_CONFIG.padding.lg;
export const PADDING_XL = STYLE_CONFIG.padding.xl;

export const BACKDROP_FILTER_BLUR = STYLE_CONFIG.animation.backdropFilterBlur;

export const TABLE_ACTIONS_CELL_W = STYLE_CONFIG.table.actionsCellW;
export const TABLE_ROW_H = STYLE_CONFIG.table.rowH;
export const TABLE_CELL_H = STYLE_CONFIG.table.cellH;
export const TABLE_ROW_GAP = STYLE_CONFIG.table.rowGap;
