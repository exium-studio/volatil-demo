// src/design-system/components/input/ui/password-input.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import type {
  PasswordInputProps,
  PasswordStrengthMeterProps,
} from "@/design-system/components/input/types/password-input.type";
import { Input } from "@/design-system/components/input/ui/input";
import { InputGroup } from "@/design-system/components/input/ui/input-group";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { mergeRefs } from "@/shared/utils/react/merge-refs";
import { useControllableState, type ButtonProps } from "@chakra-ui/react";
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
      rootProps,
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
      ...restProps
    } = props;

    // Refs
    const inputRef = useRef<HTMLInputElement>(null);

    // States
    const [visible, setVisible] = useControllableState({
      value: visibleProp,
      defaultValue: defaultVisible || false,
      onChange: onVisibleChange,
    });
    const [strength, setStrength] = useState(0);

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
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

    return (
      <VStack gap={2} w={restProps?.w || "fit"}>
        <InputGroup
          endElement={
            <VisibilityTrigger
              disabled={restProps.disabled}
              onPointerDown={(e) => {
                if (restProps.disabled) return;
                if (e.button !== 0) return;
                e.preventDefault();
                setVisible(!visible);
              }}
            >
              {visible ? visibilityIcon.off : visibilityIcon.on}
            </VisibilityTrigger>
          }
          w={"full"}
          {...rootProps}
        >
          <Input
            {...restProps}
            ref={mergeRefs(ref, inputRef)}
            type={visible ? "text" : "password"}
            onChange={handleChange}
          />
        </InputGroup>

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
