// src/design-system/components/input/ui/pin-input.tsx

// src\design-system\components\input\ui\pin-input.tsx

// src\design-system\components\input\ui\pin-input.tsx

import type { PinInputProps } from "@/design-system/components/input/types/pin-input.type";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { PinInput as ChakraPinInput } from "@chakra-ui/react";
import * as React from "react";

export const PinInput = React.forwardRef<HTMLInputElement, PinInputProps>(
  function PinInput(props, ref) {
    // Props
    const {
      count = 4,
      attached = false,
      mask = false,
      fluid = true,
      inputProps,
      ...restProps
    } = props;

    // Stores
    const { theme } = useThemeStore();

    return (
      <ChakraPinInput.Root
        colorPalette={theme.colorPalette}
        attached={attached}
        mask={mask}
        w={fluid ? "full" : undefined}
        {...restProps}
      >
        <ChakraPinInput.HiddenInput ref={ref} />

        <ChakraPinInput.Control
          gap={attached ? 0 : 2}
          w={fluid ? "full" : undefined}
          display={"flex"}
        >
          {Array.from({ length: count }).map((_, index) => (
            <ChakraPinInput.Input
              key={index}
              index={index}
              flex={fluid ? 1 : undefined}
              w={fluid ? 0 : undefined}
              minW={fluid ? 0 : undefined}
              maxW={fluid ? "64px" : undefined}
              textAlign={"center"}
              rounded={attached ? undefined : theme.radii.component}
              pb={"2px"}
              fontSize={"md"}
              _first={
                attached
                  ? { borderStartRadius: theme.radii.component }
                  : undefined
              }
              _last={
                attached
                  ? { borderEndRadius: theme.radii.component }
                  : undefined
              }
              {...inputProps}
            />
          ))}
        </ChakraPinInput.Control>
      </ChakraPinInput.Root>
    );
  },
);
