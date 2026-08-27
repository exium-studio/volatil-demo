// src/design-system/components/input/ui/fieldset.tsx

import { forwardRef } from "react";
import { Fieldset as ChakraFieldset } from "@chakra-ui/react";
import type { FieldsetProps } from "@/design-system/components/input/types/fieldset.type";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { useThemeStore } from "@/design-system/stores/theme-store";

export const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(
  function Fieldset(props, ref) {
    // Props
    const { children, legend, containeredContent, ...restProps } = props;

    // Stores
    const { theme } = useThemeStore();

    return (
      <ChakraFieldset.Root ref={ref} gap={4} {...restProps}>
        {legend && (
          <ChakraFieldset.Legend fontWeight={"semibold"}>
            {legend}
          </ChakraFieldset.Legend>
        )}

        <ChakraFieldset.Content>
          {containeredContent && (
            <VStack
              p={"md"}
              border={"1px solid"}
              borderColor={"border"}
              rounded={theme.radii.component}
            >
              {children}
            </VStack>
          )}

          {!containeredContent && children}
        </ChakraFieldset.Content>
      </ChakraFieldset.Root>
    );
  },
);

Fieldset.displayName = "Fieldset";
