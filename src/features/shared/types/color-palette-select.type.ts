// src/features/shared/types/color-palette-select.type.ts

// src\features\shared\types\color-palette-select.type.ts

// src\features\shared\types\color-palette-select.type.ts

export type ColorPaletteSelectMode = "focus" | "default";

export type ColorPaletteSelectProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  selectMode?: ColorPaletteSelectMode;
  placeholder?: string;
  modalKey?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  width?: string | number;
  w?: string | number;
  disabled?: boolean;
  clearable?: boolean;
};
