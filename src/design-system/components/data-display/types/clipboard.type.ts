// src/design-system/components/data-display/types/clipboard.type.ts

import type { Clipboard as ChakraClipboard } from "@chakra-ui/react";
import type { ComponentProps } from "react";

export type ClipboardRootProps = ChakraClipboard.RootProps;
export type ClipboardRootProviderProps = ChakraClipboard.RootProviderProps;
export type ClipboardTriggerProps = ChakraClipboard.TriggerProps;
export type ClipboardControlProps = ChakraClipboard.ControlProps;
export type ClipboardIndicatorProps = ChakraClipboard.IndicatorProps;
export type ClipboardInputProps = ChakraClipboard.InputProps;
export type ClipboardLabelProps = ChakraClipboard.LabelProps;
export type ClipboardContextProps = ComponentProps<
  typeof ChakraClipboard.Context
>;
export type ClipboardValueTextProps = ChakraClipboard.ValueTextProps;
export type ClipboardCopyTextProps = ChakraClipboard.IndicatorProps;

export type ClipboardButtonProps = import("@/design-system/components/button/types/button.type").ButtonProps & {
  value?: string;
  isIconButton?: boolean;
};
