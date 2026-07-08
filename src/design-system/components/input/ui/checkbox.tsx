// src/design-system/components/input/ui/checkbox.tsx

import type { CheckboxProps } from "@/design-system/components/input/types/checkbox.type";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { Checkbox as ChakraCheckbox } from "@chakra-ui/react";

export const Checkbox = (props: CheckboxProps) => {
  // Props
  const { children, controlProps, ...restProps } = props;

  // Stores
  const { theme } = useThemeStore();

  return (
    <ChakraCheckbox.Root colorPalette={theme.colorPalette} {...restProps}>
      <ChakraCheckbox.HiddenInput />

      <ChakraCheckbox.Control cursor={"pointer"} {...controlProps} />
      {children}
    </ChakraCheckbox.Root>
  );
};
