// src/shared/types/byte.formatter.type.ts

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
