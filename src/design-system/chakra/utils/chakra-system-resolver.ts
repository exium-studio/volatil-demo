// src\design-system\chakra\utils\chakra-system-resolver.ts

import { chakraConfig } from "@/design-system/chakra/chakra-system";
import type { TokenNode } from "@/design-system/chakra/types/chakra-system-resolver.type";
import type { ColorMode } from "@/design-system/hooks/types/use-color-mode.type";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export const resolveColorToken = (
  token: string | null,
): string | null => {
  if (!token) return null;

  const cleanPath = token.replace(/^colors\./, "").replace(/[{}]/g, "");
  const parts = cleanPath.split(".");
  const colorTokens = chakraConfig.theme?.tokens?.colors;
  if (!colorTokens || !isObject(colorTokens)) return null;

  if (parts.length === 1) {
    const directValue = colorTokens[parts[0]]?.value;
    return typeof directValue === "string" ? directValue : null;
  }

  const [colorKey, scale] = parts;
  // @ts-expect-error allow accessing nested object properties dynamically
  const scaleValue = colorTokens[colorKey]?.[scale]?.value;
  return typeof scaleValue === "string" ? scaleValue : null;
};

export const resolveSemanticColor = (
  token: string | null,
  colorMode: ColorMode,
): string | null => {
  if (!token) return null;

  // Direct token lookup fallback if token starts with a known scale or format
  const semanticColors = chakraConfig.theme?.semanticTokens?.colors;
  if (!semanticColors || !isObject(semanticColors)) return resolveColorToken(token);

  const cleanPath = token.replace(/^colors\./, "");
  const parts = cleanPath.split(".");

  const group = semanticColors[parts[0]];
  if (!isObject(group)) return resolveColorToken(token);

  const tokenNode = group[parts[1]];
  if (!isObject(tokenNode)) return resolveColorToken(token);

  const value = (tokenNode as TokenNode).value;
  if (!value) return resolveColorToken(token);

  if (typeof value === "string") return value;

  const resolvedTokenRaw = colorMode === "light" ? value.base : value._dark;
  const resolvedToken = resolvedTokenRaw
    ?.replace(/\s*!important/g, "")
    .replace(/[{}]/g, "");

  if (typeof resolvedToken !== "string") return "";

  const resolvedTokenParts = resolvedToken?.split(".");
  const colorKey = resolvedTokenParts[1];
  const colorPaletteScale = resolvedTokenParts[2];
  const colorTokens = chakraConfig.theme?.tokens?.colors;
  const colorAbsoluteValue = colorTokens?.[colorKey]?.value;

  if (colorAbsoluteValue) {
    return colorAbsoluteValue as string;
  }

  const colorPalettedValue =
    // @ts-expect-error allow accessing nested object properties dynamically
    colorTokens?.[colorKey]?.[colorPaletteScale]?.value;

  return colorPalettedValue ?? null;
};
