// src/design-system/components/input/ui/password-input.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { useFieldContextValue } from "@/design-system/components/input/context/field.context";
import type {
  PasswordInputProps,
  PasswordStrengthMeterProps,
} from "@/design-system/components/input/types/password-input.type";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { ClampedP } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { mergeRefs } from "@/shared/utils/react/merge-refs";
import {
  Input as ChakraInput,
  InputGroup as ChakraInputGroup,
  useControllableState,
  type ButtonProps,
} from "@chakra-ui/react";
import { passwordStrength, type Options } from "check-password-strength";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { forwardRef, useRef, useState, type ChangeEvent } from "react";

const DEFAULT_STRENGTH_OPTIONS: Options<string> = [
  { id: 1, value: "weak", minDiversity: 0, minLength: 0 },
  { id: 2, value: "medium", minDiversity: 2, minLength: 6 },
  { id: 3, value: "strong", minDiversity: 3, minLength: 8 },
  { id: 4, value: "very-strong", minDiversity: 4, minLength: 10 },
];

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(props, ref) {
    // Props
    const {
      rootProps: _rootProps,
      defaultVisible,
      visible: visibleProp,
      onVisibleChange,
      visibilityIcon = {
        on: <AppIcon icon={EyeIcon} />,
        off: <AppIcon icon={EyeOffIcon} />,
      },
      withPasswordStrength = false,
      strengthOptions = DEFAULT_STRENGTH_OPTIONS,
      onChange,
      startElement,
      ...restProps
    } = props;

    // Refs
    const inputRef = useRef<HTMLInputElement>(null);

    // Contexts
    const fieldContext = useFieldContextValue();
    const isFloatingVariant = fieldContext?.variant === "floating";
    const floatingLabel = isFloatingVariant ? fieldContext?.label : undefined;
    const isOptional = fieldContext?.optional;

    // Stores
    const { theme } = useThemeStore();

    // States
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [hasValueState, setHasValueState] = useState<boolean>(
      Boolean(restProps.value) || Boolean(restProps.defaultValue),
    );
    const [visible, setVisible] = useControllableState({
      value: visibleProp,
      defaultValue: defaultVisible || false,
      onChange: onVisibleChange,
    });
    const [strength, setStrength] = useState(0);

    // Derived Values
    const hasValue =
      hasValueState ||
      Boolean(restProps.value) ||
      Boolean(restProps.defaultValue) ||
      Boolean(fieldContext?.hasValue);
    const isLabelFloating = isFocused || hasValue;

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
      setHasValueState(Boolean(e.currentTarget.value));
      onChange?.(e);

      if (!withPasswordStrength) return;

      const value = e.currentTarget.value;

      if (!value) {
        setStrength(0);
        return;
      }

      const result = passwordStrength(value, strengthOptions);
      setStrength(result.id);
    }

    const endElementNode = (
      <VisibilityTrigger
        disabled={restProps.disabled}
        variant={"plain"}
        onPointerDown={(e) => {
          if (restProps.disabled) return;
          if (e.button !== 0) return;
          e.preventDefault();
          setVisible(!visible);
        }}
      >
        {visible ? visibilityIcon.off : visibilityIcon.on}
      </VisibilityTrigger>
    );

    const inputCore = (
      <ChakraInput
        {...restProps}
        ref={mergeRefs(ref, inputRef)}
        type={visible ? "text" : "password"}
        colorPalette={"neutral"}
        fontSize={"md"}
        rounded={theme.radii.component}
        placeholder={"••••••••"}
        onFocusCapture={(e) => {
          setIsFocused(true);
          restProps.onFocusCapture?.(e);
        }}
        onBlurCapture={(e) => {
          setIsFocused(false);
          setHasValueState(Boolean(e.currentTarget.value));
          restProps.onBlurCapture?.(e);
        }}
        onChange={handleChange}
        {...(isFloatingVariant && {
          h: "60px",
          pt: floatingLabel ? "24px" : "0px",
          pb: floatingLabel ? "4px" : "0px",
          _placeholder: {
            color: "transparent",
          },
        })}
      />
    );

    const inputGroupElement = (
      <ChakraInputGroup
        startElement={startElement}
        endElement={endElementNode}
        w={"full"}
      >
        {inputCore}
      </ChakraInputGroup>
    );

    const labelLeft = startElement ? "40px" : "12px";

    return (
      <VStack gap={2} w={restProps?.w || "full"}>
        {isFloatingVariant && floatingLabel ? (
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

            {inputGroupElement}
          </Box>
        ) : (
          inputGroupElement
        )}

        {withPasswordStrength && (
          <PasswordStrengthMeter
            max={strengthOptions.length}
            value={strength}
          />
        )}
      </VStack>
    );
  },
);

const VisibilityTrigger = forwardRef<HTMLButtonElement, ButtonProps>(
  function VisibilityTrigger(props, ref) {
    return (
      <IconButton
        tabIndex={-1}
        ref={ref}
        size={"xs"}
        variant={"ghost"}
        aspectRatio={"square"}
        mr={-2}
        aria-label={"Toggle password visibility"}
        {...props}
      />
    );
  },
);

export const PasswordStrengthMeter = forwardRef<
  HTMLDivElement,
  PasswordStrengthMeterProps
>(function PasswordStrengthMeter(props, ref) {
  const { max = 4, value, ...rest } = props;

  const percent = (value / max) * 100;
  const { colorPalette } = getColorPalette(percent);

  return (
    <VStack align={"end"} gap={1} ref={ref} {...rest}>
      <HStack gap={1} w={"full"} {...rest}>
        {Array.from({ length: max }).map((_, index) => (
          <Box
            key={index}
            height={1}
            flex={1}
            rounded={"sm"}
            data-selected={index < value ? "" : undefined}
            layerStyle={"fill.subtle"}
            colorPalette={"neutral"}
            _selected={{
              colorPalette,
              layerStyle: "fill.solid",
            }}
          />
        ))}
      </HStack>
      {/* {label && <HStack textStyle="xs">{label}</HStack>} */}
    </VStack>
  );
});

function getColorPalette(percent: number) {
  switch (true) {
    case percent < 33:
      return { label: "Low", colorPalette: "red" };
    case percent < 66:
      return { label: "Medium", colorPalette: "orange" };
    default:
      return { label: "High", colorPalette: "green" };
  }
}
