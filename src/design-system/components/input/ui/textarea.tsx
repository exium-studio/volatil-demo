import { useFieldContextValue } from "@/design-system/components/input/context/field.context";
import type { TextareaProps } from "@/design-system/components/input/types/textarea.type";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { Textarea as ChakraTextarea } from "@chakra-ui/react";
import * as React from "react";
import { useState } from "react";

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(props, ref) {
    // Contexts
    const fieldContext = useFieldContextValue();
    const isFloatingVariant = fieldContext?.variant === "floating";
    const floatingLabel = isFloatingVariant ? fieldContext?.label : undefined;
    const isOptional = fieldContext?.optional;

    // States
    const [isFocused, setIsFocused] = useState<boolean>(false);

    // Derived Values
    const hasValue =
      Boolean(props.value) ||
      Boolean(props.defaultValue) ||
      Boolean(fieldContext?.hasValue);
    const isLabelFloating = isFocused || hasValue;

    // Stores
    const { theme } = useThemeStore();

    const textareaElement = (
      <ChakraTextarea
        ref={ref}
        rounded={theme.radii.component}
        fontSize={"md"}
        minH={isFloatingVariant ? "60px" : "135px"}
        onFocusCapture={(e) => {
          setIsFocused(true);
          props.onFocusCapture?.(e);
        }}
        onBlurCapture={(e) => {
          setIsFocused(false);
          props.onBlurCapture?.(e);
        }}
        {...(isFloatingVariant && {
          h: "60px",
          pt: floatingLabel ? "28px" : "8px",
          pb: "4px",
          _placeholder: {
            color: "transparent",
          },
        })}
        {...props}
      />
    );

    if (isFloatingVariant && floatingLabel) {
      return (
        <Box position={"relative"} w={"full"}>
          <Box
            position={"absolute"}
            left={"12px"}
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

          {textareaElement}
        </Box>
      );
    }

    return textareaElement;
  },
);
