// src/design-system/constants/styles.ts

import type { ButtonProps } from "@/design-system/components/button/types/button.type";
import type { InputProps } from "@/design-system/components/input/types/input.type";

export const DIMENSIONS = {
  smScreenBreakpoint: "720px",
  modalControlContainerW: "70px",
  headerH: "56px",
  feedbackContainerMinH: "250px",
} as const;

export const MODAL = {
  baseZIndex: 1400,
  controlContainerSpacingR: 1.5,
  animationDurationMs: 300,
  defaultDialogClickOriginAnimation: false,
} as const;

export const SIZES = {
  mainButton: ["lg", null, "md"] as ButtonProps["size"],
  mainInput: ["lg", null, "md"] as InputProps["size"],
} as const;

export const ICONS = {
  lucideBaseBoxSize: 5,
  lucideMenuBoxSize: 4.5,
  tablerBaseBoxSize: 5,
  tablerMenuBoxSize: 4.5,
} as const;

export const SPACING = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "24px",
  xl: "32px",
} as const;

export const PADDING = {
  sm: "8px",
  md: "16px",
  lg: "22px",
  xl: "28px",
} as const;

export const ANIMATION = {
  backdropFilterBlur: "blur(2px)",
} as const;

export const TABLE = {
  actionsCellW: "56px",
  rowH: "56px",
  cellH: "56px",
  rowGap: "4px",
} as const;
