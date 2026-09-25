// src\design-system\components\input\ui\number-input.tsx

// src\design-system\components\input\ui\number-input.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { useFieldContextValue } from "@/design-system/components/input/context/field.context";
import type {
  NumberInputProps,
  SteppedNumberInputProps,
} from "@/design-system/components/input/types/number-input.type";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { Group } from "@/design-system/components/layout/ui/group";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { ClampedP } from "@/design-system/components/typography/ui/p";
import { VISUALLY_HIDDEN_INPUT_STYLE } from "@/design-system/constants/css-preset";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { dispatchNativeInputEvent } from "@/shared/utils/dom/dispatch-native-input-event";
import { mergeRefs } from "@/shared/utils/react/merge-refs";
import { NumberInput as ChakraNumberInput } from "@chakra-ui/react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// `valueAsNumber` is NaN while the input is empty (Number("") === NaN).
function toSyncValue(valueAsNumber: number): string {
  return Number.isNaN(valueAsNumber) ? "" : String(valueAsNumber);
}

function checkHasValue(val: unknown): boolean {
  return val !== undefined && val !== null && val !== "";
}

export const NumberInput = (props: NumberInputProps) => {
  // Props
  const { placeholder, inputProps, startElement, ...restProps } = props;

  // Contexts
  const fieldContext = useFieldContextValue();
  const isFloatingVariant = fieldContext?.variant === "floating";
  const floatingLabel = isFloatingVariant ? fieldContext?.label : undefined;
  const isOptional = fieldContext?.optional;

  // Stores
  const { theme } = useThemeStore();

  // Refs
  // Dedicated node for RHF — decoupled from the visible input, so whatever
  // Ark renders there (raw digits or a formatOptions-formatted string like
  // "€45.00") never touches what register()/getValues() reads. Must be
  // type="text" (visually hidden), NOT type="hidden" — React doesn't wire up
  // its synthetic event/value-tracking system the same way for type="hidden".
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const visibleInputRef = useRef<HTMLInputElement>(null);

  // States
  const [startElementWidth, setStartElementWidth] = useState<number>(0);

  const startElementRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      setStartElementWidth(node.offsetWidth);
    } else {
      setStartElementWidth(0);
    }
  }, []);

  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [hasValueState, setHasValueState] = useState<boolean>(
    checkHasValue(restProps.value) ||
      checkHasValue(restProps.defaultValue) ||
      checkHasValue(inputProps?.value) ||
      checkHasValue(inputProps?.defaultValue),
  );

  // Effects
  useEffect(() => {
    if (visibleInputRef.current) {
      const domHasValue = Boolean(visibleInputRef.current.value);
      if (domHasValue !== hasValueState) {
        setHasValueState(domHasValue);
      }
    }
  }, [hasValueState, restProps.value, restProps.defaultValue]);

  // Derived Values
  const hasValue =
    hasValueState ||
    checkHasValue(restProps.value) ||
    checkHasValue(restProps.defaultValue) ||
    checkHasValue(inputProps?.value) ||
    checkHasValue(inputProps?.defaultValue) ||
    Boolean(fieldContext?.hasValue);
  const isLabelFloating = isFocused || hasValue;

  const numberInputCore = (
    <ChakraNumberInput.Root
      {...restProps}
      onValueChange={(details) => {
        setHasValueState(details.value !== "");
        restProps.onValueChange?.({
          value: details.valueAsNumber,
          formattedValue: details.value,
        });
        if (hiddenInputRef.current) {
          dispatchNativeInputEvent(
            hiddenInputRef.current,
            toSyncValue(details.valueAsNumber),
          );
        }
      }}
    >
      <input
        type={"text"}
        style={VISUALLY_HIDDEN_INPUT_STYLE}
        tabIndex={-1}
        aria-hidden
        defaultValue={
          inputProps?.defaultValue ??
          (restProps.defaultValue !== undefined
            ? String(restProps.defaultValue)
            : undefined)
        }
        {...inputProps}
        ref={mergeRefs(hiddenInputRef, inputProps?.ref)}
      />
      <Box position={"relative"} w={"full"}>
        {startElement && (
          <Box
            ref={startElementRef}
            position={"absolute"}
            left={"12px"}
            top={"50%"}
            transform={"translateY(-50%)"}
            zIndex={2}
            display={"inline-flex"}
            alignItems={"center"}
            pointerEvents={"none"}
          >
            {startElement}
          </Box>
        )}
        <ChakraNumberInput.Input
          ref={visibleInputRef}
          placeholder={placeholder}
          fontSize={"md"}
          rounded={theme.radii.component}
          {...(startElement && {
            ps: `${(startElementWidth || 20) + 20}px`,
          })}
          onFocusCapture={() => {
            setIsFocused(true);
          }}
          onBlurCapture={(e) => {
            setIsFocused(false);
            setHasValueState(Boolean(e.currentTarget.value));
          }}
          {...(isFloatingVariant && {
            h: "60px",
            pt: floatingLabel ? "22px" : "0px",
            pb: floatingLabel ? "4px" : "0px",
            _placeholder: {
              color: "transparent",
            },
          })}
        />
      </Box>
      <ChakraNumberInput.Control>
        <ChakraNumberInput.IncrementTrigger
          roundedTopRight={`calc(${theme.radii.component} - 1px)`}
        />
        <ChakraNumberInput.DecrementTrigger
          roundedBottomRight={`calc(${theme.radii.component} - 1px)`}
        />
      </ChakraNumberInput.Control>
    </ChakraNumberInput.Root>
  );

  if (isFloatingVariant && floatingLabel) {
    const labelLeft = startElement
      ? `${(startElementWidth || 20) + 20}px`
      : "12px";

    return (
      <Box position={"relative"} w={restProps.w || "full"}>
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

        {numberInputCore}
      </Box>
    );
  }

  return numberInputCore;
};

export const SteppedNumberInput = (props: SteppedNumberInputProps) => {
  // Props
  const {
    placeholder,
    size,
    hiddenInputProps,
    buttonVariant = "outline",
    ...restProps
  } = props;

  // Stores
  const { theme } = useThemeStore();

  // Refs
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  return (
    <ChakraNumberInput.Root
      size={size}
      w={"min"}
      {...restProps}
      onValueChange={(details) => {
        restProps.onValueChange?.({
          value: details.valueAsNumber,
          formattedValue: details.value,
        });
        if (hiddenInputRef.current) {
          dispatchNativeInputEvent(
            hiddenInputRef.current,
            toSyncValue(details.valueAsNumber),
          );
        }
      }}
    >
      <input
        type={"text"}
        style={VISUALLY_HIDDEN_INPUT_STYLE}
        tabIndex={-1}
        aria-hidden
        {...hiddenInputProps}
        ref={mergeRefs(hiddenInputRef, hiddenInputProps?.ref)}
      />

      <Group attached align={"center"}>
        <ChakraNumberInput.DecrementTrigger asChild>
          <IconButton flex={0} variant={buttonVariant} size={size}>
            <AppIcon icon={MinusIcon} />
          </IconButton>
        </ChakraNumberInput.DecrementTrigger>

        <ChakraNumberInput.Input
          placeholder={placeholder}
          flex={1}
          minW={"calc(24px + 3ch)"}
          rounded={theme.radii.component}
          textAlign={"center"}
          fontSize={"md"}
        />

        <ChakraNumberInput.IncrementTrigger asChild>
          <IconButton flex={0} variant={buttonVariant} size={size}>
            <AppIcon icon={PlusIcon} />
          </IconButton>
        </ChakraNumberInput.IncrementTrigger>
      </Group>
    </ChakraNumberInput.Root>
  );
};
