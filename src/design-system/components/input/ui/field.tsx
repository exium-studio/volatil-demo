// src/design-system/components/input/ui/field.tsx

import type { FieldProps } from "@/design-system/components/input/types/field.type";
import { P } from "@/design-system/components/typography/ui/p";
import { Badge, Field as ChakraField } from "@chakra-ui/react";
import { forwardRef } from "react";

export const Field = forwardRef<HTMLDivElement, FieldProps>(
  function Field(props, ref) {
    // Props
    const {
      label,
      labelProps,
      children,
      helperText,
      errorText,
      optional,
      ...restProps
    } = props;

    return (
      <ChakraField.Root ref={ref} gap={1} {...restProps}>
        {label && (
          <ChakraField.Label fontSize={"md"} {...labelProps}>
            <P fontSize={"xs"} fontWeight={"medium"} color={"fg.subtle"}>
              {label}
            </P>

            {optional && (
              <Badge fontSize={"2xs"} colorPalette={"gray"} color={"fg.subtle"}>
                Optional
              </Badge>
            )}
          </ChakraField.Label>
        )}

        {children}

        {helperText && (
          <ChakraField.HelperText>{helperText}</ChakraField.HelperText>
        )}

        {errorText && (
          <ChakraField.ErrorText>{errorText}</ChakraField.ErrorText>
        )}
      </ChakraField.Root>
    );
  },
);
