import { FieldContext } from "@/design-system/components/input/context/field.context";
import type { FieldProps } from "@/design-system/components/input/types/field.type";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import { Field as ChakraField } from "@chakra-ui/react";
import {
  Children,
  forwardRef,
  isValidElement,
  useMemo,
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
      hasValue: hasValueProp,
      isFloating: isFloatingProp,
      ...restProps
    } = props;

    // Derived Values
    // Inspect children props recursively to resolve hasValue if not explicitly provided
    const childHasValue = useMemo(() => {
      let found = false;
      const scan = (nodes: ReactNode) => {
        Children.forEach(nodes, (child) => {
          if (found || !isValidElement(child)) return;
          const childProps = child.props as Record<string, unknown>;
          if (
            (childProps.value !== undefined &&
              childProps.value !== null &&
              childProps.value !== "") ||
            (childProps.defaultValue !== undefined &&
              childProps.defaultValue !== null &&
              childProps.defaultValue !== "") ||
            childProps["data-has-value"] === "true" ||
            childProps.hasValue === true
          ) {
            found = true;
            return;
          }
          if (childProps.children) {
            scan(childProps.children as ReactNode);
          }
        });
      };
      scan(children);
      return found;
    }, [children]);

    const resolvedHasValue =
      hasValueProp !== undefined ? hasValueProp : childHasValue;
    const isFloating =
      isFloatingProp !== undefined ? isFloatingProp : resolvedHasValue;

    if (variant === "floating") {
      return (
        <ChakraField.Root ref={ref} gap={1} {...restProps}>
          <FieldContext.Provider
            value={{
              variant,
              isFloating,
              hasValue: resolvedHasValue,
              label,
              optional,
              labelProps,
            }}
          >
            {children}
          </FieldContext.Provider>

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

        <FieldContext.Provider
          value={{
            variant,
            isFloating: false,
            hasValue: Boolean(hasValueProp),
          }}
        >
          {children}
        </FieldContext.Provider>

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
