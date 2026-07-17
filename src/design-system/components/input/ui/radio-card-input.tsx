// src/design-system/components/input/ui/radio-card-input.tsx

import type {
  RadioCardInputItemControlProps,
  RadioCardInputItemDescriptionProps,
  RadioCardInputItemIndicatorProps,
  RadioCardInputItemProps,
  RadioCardInputItemTextProps,
  RadioCardInputLabelProps,
  RadioCardInputRootProps,
} from "@/design-system/components/input/types/radio-card-input.type";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { RadioCard as ChakraRadioCard } from "@chakra-ui/react";
import * as React from "react";

const RadioCardInputRoot = React.forwardRef<
  HTMLDivElement,
  RadioCardInputRootProps
>(function RadioCardInputRoot(props, ref) {
  const { children, ...restProps } = props;
  const { theme } = useThemeStore();

  return (
    <ChakraRadioCard.Root
      ref={ref}
      colorPalette={theme.colorPalette}
      {...restProps}
    >
      {children}
    </ChakraRadioCard.Root>
  );
});

const RadioCardInputLabel = React.forwardRef<
  HTMLDivElement,
  RadioCardInputLabelProps
>(function RadioCardInputLabel(props, ref) {
  const { children, ...restProps } = props;

  return (
    <ChakraRadioCard.Label ref={ref} {...restProps}>
      {children}
    </ChakraRadioCard.Label>
  );
});

const RadioCardInputItem = React.forwardRef<
  HTMLDivElement,
  RadioCardInputItemProps
>(function RadioCardInputItem(props, ref) {
  const { children, value, hideCheckedOutline = false, ...restProps } = props;
  const { theme } = useThemeStore();

  return (
    <ChakraRadioCard.Item
      ref={ref}
      value={value}
      cursor={"pointer"}
      rounded={theme.radii.component}
      _checked={
        hideCheckedOutline
          ? {
              borderColor: "border",
              boxShadow: "none",
            }
          : undefined
      }
      {...restProps}
    >
      <ChakraRadioCard.ItemHiddenInput />
      {children}
    </ChakraRadioCard.Item>
  );
});

const RadioCardInputItemControl = React.forwardRef<
  HTMLDivElement,
  RadioCardInputItemControlProps
>(function RadioCardInputItemControl(props, ref) {
  const { children, ...restProps } = props;

  return (
    <ChakraRadioCard.ItemControl ref={ref} {...restProps}>
      {children}
    </ChakraRadioCard.ItemControl>
  );
});

const RadioCardInputItemText = React.forwardRef<
  HTMLDivElement,
  RadioCardInputItemTextProps
>(function RadioCardInputItemText(props, ref) {
  const { children, ...restProps } = props;

  return (
    <ChakraRadioCard.ItemText ref={ref} fontWeight={"medium"} {...restProps}>
      {children}
    </ChakraRadioCard.ItemText>
  );
});

const RadioCardInputItemDescription = React.forwardRef<
  HTMLDivElement,
  RadioCardInputItemDescriptionProps
>(function RadioCardInputItemDescription(props, ref) {
  const { children, ...restProps } = props;

  return (
    <ChakraRadioCard.ItemDescription ref={ref} {...restProps}>
      {children}
    </ChakraRadioCard.ItemDescription>
  );
});

const RadioCardInputItemIndicator = React.forwardRef<
  HTMLDivElement,
  RadioCardInputItemIndicatorProps
>(function RadioCardInputItemIndicator(props, ref) {
  return <ChakraRadioCard.ItemIndicator ref={ref} {...props} />;
});

export const RadioCardInput = {
  Root: RadioCardInputRoot,
  Label: RadioCardInputLabel,
  Item: RadioCardInputItem,
  ItemControl: RadioCardInputItemControl,
  ItemText: RadioCardInputItemText,
  ItemDescription: RadioCardInputItemDescription,
  ItemIndicator: RadioCardInputItemIndicator,
};
