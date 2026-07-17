// src/design-system/components/input/ui/checkbox.tsx

import type { CheckboxProps } from "@/design-system/components/input/types/checkbox.type";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { Checkbox as ChakraCheckbox } from "@chakra-ui/react";

export const Checkbox = (props: CheckboxProps) => {
  // Props
  const { children, controlProps, variant = "subtle", ...restProps } = props;

  // Stores
  const { theme } = useThemeStore();

  // Derived Values
  const isSubtleVariant = variant === "subtle";

  return (
    <ChakraCheckbox.Root
      colorPalette={theme.colorPalette}
      variant={variant}
      {...restProps}
    >
      <ChakraCheckbox.HiddenInput />

      <ChakraCheckbox.Control
        cursor={"pointer"}
        bg={isSubtleVariant ? "bg.muted" : undefined}
        _checked={
          isSubtleVariant
            ? {
                bg: `${theme.colorPalette}.solid`,
              }
            : undefined
        }
        {...controlProps}
      />
      {children}
    </ChakraCheckbox.Root>
  );
};
