<<<<<<< HEAD
// src/shared/types/byte.formatter.type.ts

=======
>>>>>>> fd4996e3 (refactor: overhaul design system toast architecture, introduce shared utility types, and refine component interfaces across features)
export type ByteUnit =
  | "B"
  | "KB"
  | "MB"
  | "GB"
  | "TB"
  | "PB"
  | "EB"
  | "ZB"
  | "YB";

export type FormatByteOptions = {
  unit?: ByteUnit;
  decimals?: number;
};
