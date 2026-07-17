// src/shared/utils/style/color.ts

export function tintDark(color: string, percent: number): string {
  return `color-mix(in srgb, {colors.${color}} ${100 - percent}%, black ${percent}%)`;
}

export function tintLight(color: string, percent: number): string {
  return `color-mix(in srgb, {colors.${color}} ${100 - percent}%, white ${percent}%)`;
}
