// src/design-system/components/input/ui/switch.tsx

import type { SwitchProps } from "@/design-system/components/input/types/switch.type";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { Switch as ChakraSwitch } from "@chakra-ui/react";
import * as React from "react";

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  function Switch(props, ref) {
    // Props
    const { children, controlProps, thumbProps, tooltip, ...restProps } = props;

    // Stores
    const { theme } = useThemeStore();

    const switchNode = (
      <ChakraSwitch.Root colorPalette={theme.colorPalette} {...restProps}>
        <ChakraSwitch.HiddenInput ref={ref} />
        <ChakraSwitch.Control cursor={"pointer"} {...controlProps}>
          <ChakraSwitch.Thumb {...thumbProps} />
        </ChakraSwitch.Control>
        {children && <ChakraSwitch.Label>{children}</ChakraSwitch.Label>}
      </ChakraSwitch.Root>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{switchNode}</Tooltip>;
    }

    return switchNode;
  },
);
