// src/design-system/components/input/ui/field.tsx

import type { FieldProps } from "@/design-system/components/input/types/field.type";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import { Field as ChakraField } from "@chakra-ui/react";
import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

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
      variant = "floating",
      ...restProps
    } = props;

    // Refs
    const containerRef = useRef<HTMLDivElement>(null);

    // States
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [hasValue, setHasValue] = useState<boolean>(false);

    // Handlers
    const checkValueFromDom = useCallback(() => {
      const el = containerRef.current?.querySelector<
        HTMLInputElement | HTMLTextAreaElement
      >("input:not([type='hidden']), textarea");
      if (el) {
        setHasValue(Boolean(el.value));
      }
    }, []);

    // Effects
    useLayoutEffect(() => {
      if (variant === "floating") {
        checkValueFromDom();
      }
    }, [variant, checkValueFromDom]);

    // Derived Values
    const isFloating = isFocused || hasValue;

    if (variant === "floating") {
      const stripPlaceholder = (node: ReactNode): ReactNode => {
        return Children.map(node, (child) => {
          if (!isValidElement(child)) {
            return child;
          }

          const childProps = child.props as Record<string, unknown>;
          const modifiedProps: Record<string, unknown> = {};

          if ("placeholder" in childProps) {
            modifiedProps.placeholder = "";
          }

          if (childProps.children) {
            modifiedProps.children = stripPlaceholder(
              childProps.children as ReactNode,
            );
          }

          return cloneElement(child, modifiedProps);
        });
      };

      return (
        <ChakraField.Root ref={ref} gap={1} {...restProps}>
          <Box
            ref={containerRef}
            position={"relative"}
            w={"full"}
            onFocusCapture={() => setIsFocused(true)}
            onBlurCapture={(e) => {
              setIsFocused(false);
              const target = e.target as HTMLInputElement | HTMLTextAreaElement;
              if (target && "value" in target) {
                setHasValue(Boolean(target.value));
              } else {
                checkValueFromDom();
              }
            }}
            onInputCapture={(e) => {
              const target = e.target as HTMLInputElement | HTMLTextAreaElement;
              if (target && "value" in target) {
                setHasValue(Boolean(target.value));
              }
            }}
            css={{
              "& input": {
                height: "60px",
                paddingTop: "24px",
                paddingBottom: "4px",
              },
              "& textarea": {
                height: "60px",
                paddingTop: "28px",
                paddingBottom: "4px",
              },
              "& input::placeholder, & textarea::placeholder": {
                color: "transparent",
              },
            }}
          >
            {label && (
              <ChakraField.Label
                position={"absolute"}
                left={"12px"}
                top={"7px"}
                zIndex={2}
                pointerEvents={"none"}
                transform={isFloating ? "translateY(0)" : "translateY(12px)"}
                transition={
                  "transform 0.18s cubic-bezier(0.4, 0, 0.2, 1), font-size 0.18s cubic-bezier(0.4, 0, 0.2, 1), color 0.18s ease"
                }
                mb={0}
                {...labelProps}
              >
                <HStack align={"center"} gap={2}>
                  <P
                    fontSize={isFloating ? "xs" : "md"}
                    fontWeight={"medium"}
                    color={"fg.subtle"}
                    transition={"font-size 0.18s cubic-bezier(0.4, 0, 0.2, 1)"}
                  >
                    {label}
                  </P>

                  {optional && isFloating && (
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
              </ChakraField.Label>
            )}

            {stripPlaceholder(children)}
          </Box>

          {helperText && (
            <ChakraField.HelperText fontSize={"xs"} mt={"2px"}>
              {helperText}
            </ChakraField.HelperText>
          )}

          {errorText && (
            <ChakraField.ErrorText>{errorText}</ChakraField.ErrorText>
          )}
        </ChakraField.Root>
      );
    }

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
          <ChakraField.HelperText fontSize={"xs"} mt={"2px"}>
            {helperText}
          </ChakraField.HelperText>
        )}

        {errorText && (
          <ChakraField.ErrorText>{errorText}</ChakraField.ErrorText>
        )}
      </ChakraField.Root>
    );
  },
);
