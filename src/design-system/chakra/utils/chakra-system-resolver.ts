// src/design-system/chakra/utils/chakra-system-resolver.ts

import { chakraConfig } from "@/design-system/chakra/chakra-system";
import type { ColorMode } from "@/design-system/hooks/use-color-mode";

type TokenValue =
  | string
  | {
      base?: string;
      _dark?: string;
    };

type TokenNode = {
  value?: TokenValue;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export const resolveSemanticColor = (
  token: string | null,
  colorMode: ColorMode,
): string | null => {
  if (!token) return null;

  const semanticColors = chakraConfig.theme?.semanticTokens?.colors;
  if (!semanticColors || !isObject(semanticColors)) return null;

  const cleanPath = token.replace(/^colors\./, "");
  const parts = cleanPath.split(".");

  const group = semanticColors[parts[0]];
  if (!isObject(group)) return null;

  const tokenNode = group[parts[1]];
  if (!isObject(tokenNode)) return null;

  const value = (tokenNode as TokenNode).value;
  if (!value) return null;

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

  return colorPalettedValue;
};
