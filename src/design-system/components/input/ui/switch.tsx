// src/design-system/components/input/ui/switch.tsx

import type { SwitchProps } from "@/design-system/components/input/types/switch.type";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { Switch as ChakraSwitch } from "@chakra-ui/react";
import * as React from "react";

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  function Switch(props, ref) {
    // Props
    const { children, controlProps, thumbProps, ...restProps } = props;

    // Stores
    const { theme } = useThemeStore();

    return (
      <ChakraSwitch.Root colorPalette={theme.colorPalette} {...restProps}>
        <ChakraSwitch.HiddenInput ref={ref} />
        <ChakraSwitch.Control cursor={"pointer"} {...controlProps}>
          <ChakraSwitch.Thumb {...thumbProps} />
        </ChakraSwitch.Control>
        {children && <ChakraSwitch.Label>{children}</ChakraSwitch.Label>}
      </ChakraSwitch.Root>
    );
  },
);
