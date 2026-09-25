// src\design-system\components\input\ui\input.tsx

// src\design-system\components\input\ui\input.tsx

import { useFieldContextValue } from "@/design-system/components/input/context/field.context";
import type { InputProps } from "@/design-system/components/input/types/input.type";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { ClampedP } from "@/design-system/components/typography/ui/p";
import { toast } from "@/design-system/components/toast";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { mergeRefs } from "@/shared/utils/react/merge-refs";
import {
  Input as ChakraInput,
  InputGroup as ChakraInputGroup,
} from "@chakra-ui/react";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  // Props
  const { startElement, endElement, ...restProps } = props;

  // Refs
  const internalInputRef = useRef<HTMLInputElement>(null);

  // States
  const [startElementWidth, setStartElementWidth] = useState<number>(0);

  const startElementRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      setStartElementWidth(node.offsetWidth);
    } else {
      setStartElementWidth(0);
    }
  }, []);

  // Contexts
  const fieldContext = useFieldContextValue();
  const isFloatingVariant = fieldContext?.variant === "floating";
  const floatingLabel = isFloatingVariant ? fieldContext?.label : undefined;
  const isOptional = fieldContext?.optional;

  // States
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [hasValueState, setHasValueState] = useState<boolean>(
    Boolean(restProps.value) || Boolean(restProps.defaultValue),
  );

  // Effects
  // Detect DOM value on mount or when defaultValue/value updates (e.g. React Hook Form register)
  useEffect(() => {
    if (
      internalInputRef.current &&
      Boolean(internalInputRef.current.value) !== hasValueState
    ) {
      setHasValueState(Boolean(internalInputRef.current.value));
    }
  }, [hasValueState, restProps.defaultValue, restProps.value]);

  // Derived Values
  const hasValue =
    hasValueState ||
    Boolean(restProps.value) ||
    Boolean(restProps.defaultValue) ||
    Boolean(fieldContext?.hasValue);
  const isLabelFloating = isFocused || hasValue;

  // Stores
  const { theme } = useThemeStore();

  const inputCore = (
    <ChakraInput
      ref={mergeRefs(internalInputRef, ref)}
      colorPalette={"neutral"}
      fontSize={"md"}
      rounded={theme.radii.component}
      onFocusCapture={(e) => {
        setIsFocused(true);
        restProps.onFocusCapture?.(e);
      }}
      onBlurCapture={(e) => {
        setIsFocused(false);
        setHasValueState(Boolean(e.currentTarget.value));
        restProps.onBlurCapture?.(e);
      }}
      onKeyDown={(e) => {
        if (
          restProps.maxLength !== undefined &&
          !e.ctrlKey &&
          !e.metaKey &&
          !e.altKey &&
          e.key.length === 1
        ) {
          const currentVal = e.currentTarget.value;
          const selectionLen =
            (e.currentTarget.selectionEnd ?? 0) -
            (e.currentTarget.selectionStart ?? 0);
          if (selectionLen === 0 && currentVal.length >= restProps.maxLength) {
            toast.warning(
              `Karakter telah mencapai batas maksimal (${restProps.maxLength} karakter).`,
              { id: "input-max-length-warning" },
            );
          }
        }
        restProps.onKeyDown?.(e);
      }}
      onPaste={(e) => {
        if (restProps.maxLength !== undefined) {
          const pastedText = e.clipboardData?.getData("text") ?? "";
          const currentVal = e.currentTarget.value;
          const selectionLen =
            (e.currentTarget.selectionEnd ?? 0) -
            (e.currentTarget.selectionStart ?? 0);
          const projectedLen =
            currentVal.length - selectionLen + pastedText.length;
          if (projectedLen > restProps.maxLength) {
            toast.warning(
              `Teks melebihi batas maksimal (${restProps.maxLength} karakter) dan otomatis dipotong.`,
              { id: "input-max-length-warning" },
            );
          }
        }
        restProps.onPaste?.(e);
      }}
      onChange={(e) => {
        if (
          restProps.maxLength !== undefined &&
          e.currentTarget.value.length >= restProps.maxLength
        ) {
          toast.warning(
            `Karakter telah mencapai batas maksimal (${restProps.maxLength} karakter).`,
            { id: "input-max-length-warning" },
          );
        }
        setHasValueState(Boolean(e.currentTarget.value));
        restProps.onChange?.(e);
      }}
      onInput={(e) => {
        setHasValueState(Boolean(e.currentTarget.value));
        restProps.onInput?.(e);
      }}
      {...(isFloatingVariant && {
        h: "60px",
        pt: floatingLabel ? "22px" : "0px",
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
        startElement={
          startElement ? (
            <Box ref={startElementRef} display={"inline-flex"}>
              {startElement}
            </Box>
          ) : undefined
        }
        endElement={endElement}
        w={"full"}
      >
        {inputCore}
      </ChakraInputGroup>
    ) : (
      inputCore
    );

  if (isFloatingVariant && floatingLabel) {
    const labelLeft = startElement
      ? `${(startElementWidth || 20) + 20}px`
      : "12px";

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
            <ClampedP
              fontSize={isLabelFloating ? "xs" : "md"}
              fontWeight={"medium"}
              color={"fg.subtle"}
              transition={"font-size 0.18s cubic-bezier(0.4, 0, 0.2, 1)"}
            >
              {floatingLabel}
            </ClampedP>

            {isOptional && (
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
