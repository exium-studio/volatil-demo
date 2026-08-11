// src/design-system/components/data-display/ui/clipboard.tsx

import type {
  ClipboardContextProps,
  ClipboardControlProps,
  ClipboardCopyTextProps,
  ClipboardIndicatorProps,
  ClipboardInputProps,
  ClipboardLabelProps,
  ClipboardRootProps,
  ClipboardRootProviderProps,
  ClipboardTriggerProps,
  ClipboardValueTextProps,
} from "@/design-system/components/data-display/types/clipboard.type";
import { Clipboard as ChakraClipboard } from "@chakra-ui/react";

const ClipboardRoot = (props: ClipboardRootProps) => {
  return <ChakraClipboard.Root {...props} />;
};

const ClipboardRootProvider = (props: ClipboardRootProviderProps) => {
  return <ChakraClipboard.RootProvider {...props} />;
};

const ClipboardTrigger = (props: ClipboardTriggerProps) => {
  return <ChakraClipboard.Trigger {...props} />;
};

const ClipboardControl = (props: ClipboardControlProps) => {
  return <ChakraClipboard.Control {...props} />;
};

const ClipboardIndicator = (props: ClipboardIndicatorProps) => {
  return <ChakraClipboard.Indicator {...props} />;
};

const ClipboardInput = (props: ClipboardInputProps) => {
  return <ChakraClipboard.Input {...props} />;
};

const ClipboardLabel = (props: ClipboardLabelProps) => {
  return <ChakraClipboard.Label {...props} />;
};

const ClipboardContext = (props: ClipboardContextProps) => {
  return <ChakraClipboard.Context {...props} />;
};

const ClipboardValueText = (props: ClipboardValueTextProps) => {
  return <ChakraClipboard.ValueText {...props} />;
};

const ClipboardCopyText = (props: ClipboardCopyTextProps) => {
  return <ChakraClipboard.CopyText {...props} />;
};

export const Clipboard = {
  Root: ClipboardRoot,
  RootProvider: ClipboardRootProvider,
  Trigger: ClipboardTrigger,
  Control: ClipboardControl,
  Indicator: ClipboardIndicator,
  Input: ClipboardInput,
  Label: ClipboardLabel,
  Context: ClipboardContext,
  ValueText: ClipboardValueText,
  CopyText: ClipboardCopyText,
};
