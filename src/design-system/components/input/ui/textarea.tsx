// src/design-system/components/input/ui/textarea.tsx

import { useFieldContextValue } from "@/design-system/components/input/context/field.context";
import type { TextareaProps } from "@/design-system/components/input/types/textarea.type";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { ClampedP } from "@/design-system/components/typography/ui/p";
import { toast } from "@/design-system/components/toast";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { mergeRefs } from "@/shared/utils/react/merge-refs";
import { Textarea as ChakraTextarea } from "@chakra-ui/react";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(props, ref) {
    // Props
    const { startElement, ...restProps } = props;

    // Refs
    const internalTextareaRef = useRef<HTMLTextAreaElement>(null);

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
    useEffect(() => {
      if (
        internalTextareaRef.current &&
        Boolean(internalTextareaRef.current.value) !== hasValueState
      ) {
        setHasValueState(Boolean(internalTextareaRef.current.value));
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

    const textareaElement = (
      <ChakraTextarea
        className={"noScrollbar"}
        ref={mergeRefs(internalTextareaRef, ref)}
        rounded={theme.radii.component}
        fontSize={"md"}
        minH={"135px"}
        onFocusCapture={(e) => {
          setIsFocused(true);
          props.onFocusCapture?.(e);
        }}
        onBlurCapture={(e) => {
          setIsFocused(false);
          setHasValueState(Boolean(e.currentTarget.value));
          props.onBlurCapture?.(e);
        }}
        onKeyDown={(e) => {
          if (
            props.maxLength !== undefined &&
            !e.ctrlKey &&
            !e.metaKey &&
            !e.altKey &&
            e.key.length === 1
          ) {
            const currentVal = e.currentTarget.value;
            const selectionLen =
              (e.currentTarget.selectionEnd ?? 0) -
              (e.currentTarget.selectionStart ?? 0);
            if (selectionLen === 0 && currentVal.length >= props.maxLength) {
              toast.warning(
                `Karakter telah mencapai batas maksimal (${props.maxLength} karakter).`,
                { id: "input-max-length-warning" },
              );
            }
          }
          props.onKeyDown?.(e);
        }}
        onPaste={(e) => {
          if (props.maxLength !== undefined) {
            const pastedText = e.clipboardData?.getData("text") ?? "";
            const currentVal = e.currentTarget.value;
            const selectionLen =
              (e.currentTarget.selectionEnd ?? 0) -
              (e.currentTarget.selectionStart ?? 0);
            const projectedLen =
              currentVal.length - selectionLen + pastedText.length;
            if (projectedLen > props.maxLength) {
              toast.warning(
                `Teks melebihi batas maksimal (${props.maxLength} karakter) dan otomatis dipotong.`,
                { id: "input-max-length-warning" },
              );
            }
          }
          props.onPaste?.(e);
        }}
        onChange={(e) => {
          if (
            props.maxLength !== undefined &&
            e.currentTarget.value.length >= props.maxLength
          ) {
            toast.warning(
              `Karakter telah mencapai batas maksimal (${props.maxLength} karakter).`,
              { id: "input-max-length-warning" },
            );
          }
          setHasValueState(Boolean(e.currentTarget.value));
          props.onChange?.(e);
        }}
        onInput={(e) => {
          setHasValueState(Boolean(e.currentTarget.value));
          props.onInput?.(e);
        }}
        {...(startElement && {
          ps: `${(startElementWidth || 20) + 20}px`,
        })}
        {...(isFloatingVariant && {
          h: "60px",
          pt: floatingLabel ? "28px" : "8px",
          pb: "4px",
          _placeholder: {
            color: "transparent",
          },
        })}
        {...restProps}
      />
    );

    const textareaWrapper = (
      <Box position={"relative"} w={"full"}>
        {startElement && (
          <Box
            ref={startElementRef}
            position={"absolute"}
            left={"12px"}
            top={isFloatingVariant ? "28px" : "12px"}
            zIndex={2}
            display={"inline-flex"}
            alignItems={"center"}
            pointerEvents={"none"}
          >
            {startElement}
          </Box>
        )}
        {textareaElement}
      </Box>
    );

    if (isFloatingVariant && floatingLabel) {
      const labelLeft = startElement
        ? `${(startElementWidth || 20) + 20}px`
        : "12px";

      return (
        <Box position={"relative"} w={"full"}>
          <Box
            position={"absolute"}
            top={"1px"}
            left={"1px"}
            right={"1px"}
            h={"40px"}
            zIndex={1}
            pointerEvents={"none"}
            roundedTop={theme.radii.component}
            bg={
              "linear-gradient(to bottom, {colors.bg.body} 20%,transparent 100%)"
            }
            opacity={isLabelFloating ? 1 : 0}
            transition={"opacity 0.18s ease"}
          />

          <Box
            position={"absolute"}
            left={labelLeft}
            top={"7px"}
            zIndex={2}
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

          {textareaWrapper}
        </Box>
      );
    }

    return textareaWrapper;
  },
);
