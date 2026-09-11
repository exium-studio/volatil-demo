import { useFieldContextValue } from "@/design-system/components/input/context/field.context";
import type { InputProps } from "@/design-system/components/input/types/input.type";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { Input as ChakraInput, InputGroup as ChakraInputGroup } from "@chakra-ui/react";
import { forwardRef, useState } from "react";

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  // Props
  const { startElement, endElement, ...restProps } = props;

  // Contexts
  const fieldContext = useFieldContextValue();
  const isFloatingVariant = fieldContext?.variant === "floating";
  const floatingLabel = isFloatingVariant ? fieldContext?.label : undefined;
  const isOptional = fieldContext?.optional;

  // States
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // Derived Values
  const hasValue =
    Boolean(restProps.value) ||
    Boolean(restProps.defaultValue) ||
    Boolean(fieldContext?.hasValue);
  const isLabelFloating = isFocused || hasValue;

  // Stores
  const { theme } = useThemeStore();

  const inputCore = (
    <ChakraInput
      ref={ref}
      colorPalette={"neutral"}
      fontSize={"md"}
      rounded={theme.radii.component}
      onFocusCapture={(e) => {
        setIsFocused(true);
        restProps.onFocusCapture?.(e);
      }}
      onBlurCapture={(e) => {
        setIsFocused(false);
        restProps.onBlurCapture?.(e);
      }}
      {...(isFloatingVariant && {
        h: "60px",
        pt: floatingLabel ? "24px" : "0px",
        pb: floatingLabel ? "4px" : "0px",
        _placeholder: {
          color: "transparent",
        },
      })}
      {...restProps}
    />
  );

  const inputElement =
    startElement || endElement ? (
      <ChakraInputGroup
        startElement={startElement}
        endElement={endElement}
        w={"full"}
      >
        {inputCore}
      </ChakraInputGroup>
    ) : (
      inputCore
    );

  if (isFloatingVariant && floatingLabel) {
    const labelLeft = startElement ? "40px" : "12px";

    return (
      <Box position={"relative"} w={"full"}>
        <Box
          position={"absolute"}
          left={labelLeft}
          top={"7px"}
          zIndex={1}
          pointerEvents={"none"}
          transform={isLabelFloating ? "translateY(0)" : "translateY(12px)"}
          transition={
            "transform 0.18s cubic-bezier(0.4, 0, 0.2, 1), font-size 0.18s cubic-bezier(0.4, 0, 0.2, 1), color 0.18s ease"
          }
        >
          <HStack align={"center"} gap={2}>
            <P
              fontSize={isLabelFloating ? "xs" : "md"}
              fontWeight={"medium"}
              color={"fg.subtle"}
              transition={"font-size 0.18s cubic-bezier(0.4, 0, 0.2, 1)"}
            >
              {floatingLabel}
            </P>

            {isOptional && isLabelFloating && (
              <Badge
                size={"xs"}
                fontSize={"2xs"}
                colorPalette={"gray"}
                color={"fg.subtle"}
              >
                Optional
              </Badge>
            )}
          </HStack>
        </Box>

        {inputElement}
      </Box>
    );
  }

  return inputElement;
});
