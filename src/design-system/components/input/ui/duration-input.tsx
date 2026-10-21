// src/design-system/components/input/ui/duration-input.tsx

import { useFieldContextValue } from "@/design-system/components/input/context/field.context";
import type {
  DurationInputProps,
  DurationUnit,
} from "@/design-system/components/input/types/duration-input.type";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { ClampedP } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import {
  durationToMs,
  DURATION_UNITS_DESC,
  getDurationUnitLabel,
  msToBestDuration,
} from "@/shared/utils/date/duration.utils";
import SelectInput from "@/design-system/components/input/ui/select";
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";

export const DurationInput = forwardRef<HTMLInputElement, DurationInputProps>(
  function DurationInput(props, ref) {
    // Props
    const {
      value: controlledValue,
      defaultValue,
      onValueChange,
      name,
      disabled = false,
      readOnly = false,
      placeholder = "0",
      min = 0,
      max,
      step = 1,
      allowedUnits = DURATION_UNITS_DESC,
      defaultUnit = "minute",
      w = "full",
      width = "full",
      id,
    } = props;

    // Stores
    const { theme } = useThemeStore();

    // Contexts (Floating Label)
    const fieldContext = useFieldContextValue();
    const isFloatingVariant = fieldContext?.variant === "floating";
    const floatingLabel = isFloatingVariant ? fieldContext?.label : undefined;
    const isOptional = fieldContext?.optional;

    // Derived Initial Values
    const isControlled = controlledValue !== undefined;
    const initialMs = isControlled ? controlledValue : defaultValue;

    const initialDuration = useMemo(
      () =>
        msToBestDuration(initialMs, {
          allowedUnits,
          defaultUnit,
        }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    );

    // States
    const [numValue, setNumValue] = useState<string>(
      initialMs !== undefined ? String(initialDuration.value) : "",
    );
    const [selectedUnit, setSelectedUnit] = useState<DurationUnit>(
      initialDuration.unit,
    );
    const [isFocused, setIsFocused] = useState<boolean>(false);

    // Synchronize when controlled value changes externally
    useEffect(() => {
      if (isControlled) {
        if (controlledValue === undefined) {
          setNumValue("");
          return;
        }
        const resolved = msToBestDuration(controlledValue, {
          allowedUnits,
          defaultUnit: selectedUnit,
        });
        setNumValue(String(resolved.value));
        setSelectedUnit(resolved.unit);
      }
    }, [controlledValue, isControlled, allowedUnits, selectedUnit]);

    // Derived Values
    const computedMs = useMemo(() => {
      const parsedNum = parseFloat(numValue);
      if (Number.isNaN(parsedNum)) return 0;
      return durationToMs(parsedNum, selectedUnit);
    }, [numValue, selectedUnit]);

    const hasValue =
      numValue !== "" ||
      Boolean(fieldContext?.hasValue) ||
      (isControlled && controlledValue !== undefined);
    const isLabelFloating = isFocused || hasValue;

    // Handlers
    const handleNumberChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        setNumValue(raw);

        const parsed = parseFloat(raw);
        const newMs = Number.isNaN(parsed)
          ? 0
          : durationToMs(parsed, selectedUnit);
        onValueChange?.(newMs, {
          value: Number.isNaN(parsed) ? 0 : parsed,
          unit: selectedUnit,
        });
      },
      [selectedUnit, onValueChange],
    );

    const handleUnitSelect = useCallback(
      (newVal: string) => {
        const newUnit = newVal as DurationUnit;
        setSelectedUnit(newUnit);

        const parsed = parseFloat(numValue);
        const newMs = Number.isNaN(parsed) ? 0 : durationToMs(parsed, newUnit);
        onValueChange?.(newMs, {
          value: Number.isNaN(parsed) ? 0 : parsed,
          unit: newUnit,
        });
      },
      [numValue, onValueChange],
    );

    // Available unit options
    const unitOptions = useMemo(() => {
      return allowedUnits.map((u) => ({
        value: u,
        label: getDurationUnitLabel(u),
      }));
    }, [allowedUnits]);

    // Input JSX
    const durationInputCore = (
      <HStack
        w={w || width || "full"}
        minW={0}
        h={isFloatingVariant && floatingLabel ? "60px" : "40px"}
        pl={"12px"}
        rounded={theme.radii.component}
        borderWidth={"1px"}
        borderColor={isFocused ? "border.emphasized" : "border.default"}
        align={"center"}
        justify={"space-between"}
        gap={"xs"}
        transition={"border-color 0.2s ease, box-shadow 0.2s ease"}
        boxShadow={
          isFocused
            ? "0 0 0 1px var(--chakra-colors-border-emphasized)"
            : "none"
        }
        opacity={disabled ? 0.6 : 1}
        pointerEvents={disabled ? "none" : "auto"}
      >
        {/* Hidden Input for Form Submission / RHF (in milliseconds) */}
        <input
          type={"hidden"}
          ref={ref}
          name={name}
          value={computedMs}
          readOnly={true}
        />

        {/* 1. Value Input Segment */}
        <Box
          flex={1}
          minW={0}
          h={"full"}
          display={"flex"}
          alignItems={"center"}
          {...(isFloatingVariant &&
            floatingLabel && {
              pt: "18px",
            })}
        >
          <input
            id={id}
            type={"number"}
            min={min}
            max={max}
            step={step}
            value={numValue}
            placeholder={isLabelFloating ? placeholder : ""}
            disabled={disabled}
            readOnly={readOnly}
            onChange={handleNumberChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: "1rem",
              fontWeight: "normal",
              color: "inherit",
            }}
          />
        </Box>

        {/* Divider Segment (Only separates input and select, doesn't cross floating label) */}
        <Box
          display={"flex"}
          alignItems={"center"}
          h={"full"}
          {...(isFloatingVariant &&
            floatingLabel && {
              pt: "18px",
            })}
        >
          <Box
            w={"1px"}
            h={"20px"}
            bg={"border.subtle"}
          />
        </Box>

        {/* 2. Unit Select Segment (Design System SelectInput) */}
        <Box
          w={"auto"}
          minW={"125px"}
          h={"full"}
          display={"flex"}
          alignItems={"center"}
          css={{
            "& .chakra-select__control, & [data-part='control'], & .chakra-select__trigger, & [data-part='trigger'], & button":
              {
                border: "none !important",
                borderWidth: "0 !important",
                borderColor: "transparent !important",
                boxShadow: "none !important",
                outline: "none !important",
                bg: "transparent !important",
                minH: "unset !important",
                _focus: {
                  boxShadow: "none !important",
                  border: "none !important",
                  outline: "none !important",
                },
                _focusVisible: {
                  boxShadow: "none !important",
                  border: "none !important",
                  outline: "none !important",
                },
                _active: {
                  boxShadow: "none !important",
                  border: "none !important",
                },
              },
          }}
          {...(isFloatingVariant &&
            floatingLabel && {
              pt: "18px",
            })}
        >
          <SelectInput
            value={selectedUnit}
            options={unitOptions}
            clearable={false}
            disabled={disabled || readOnly}
            onValueChange={(val) => {
              if (val) handleUnitSelect(val);
            }}
          />
        </Box>
      </HStack>
    );

    // Floating Label Wrap
    if (isFloatingVariant && floatingLabel) {
      return (
        <Box position={"relative"} w={w || width || "full"}>
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
                  {"Optional"}
                </Badge>
              )}
            </HStack>
          </Box>

          {durationInputCore}
        </Box>
      );
    }

    return durationInputCore;
  },
);
