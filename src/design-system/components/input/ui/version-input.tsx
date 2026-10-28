// src/design-system/components/input/ui/version-input.tsx

"use client";

import { useFieldContextValue } from "@/design-system/components/input/context/field.context";
import type {
  VersionFieldKey,
  VersionFieldValues,
  VersionInputProps,
  VersionSegmentInputProps,
} from "@/design-system/components/input/types/version-input.type";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { useFieldContext } from "@chakra-ui/react";
import {
  forwardRef,
  Fragment,
  memo,
  useCallback,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type RefObject,
} from "react";

// Helpers
const DEFAULT_FIELDS: VersionFieldValues = {
  major: "1",
  minor: "0",
  patch: "0",
};

const FIELD_ORDER: VersionFieldKey[] = ["major", "minor", "patch"];

const parseVersionToFields = (versionString?: string): VersionFieldValues => {
  if (!versionString) return DEFAULT_FIELDS;
  const cleaned = versionString.replace(/^v/i, "").trim();
  const parts = cleaned.split(".");
  return {
    major: parts[0] ? String(parseInt(parts[0], 10) || 0) : "1",
    minor: parts[1] ? String(parseInt(parts[1], 10) || 0) : "0",
    patch: parts[2] ? String(parseInt(parts[2], 10) || 0) : "0",
  };
};

const fieldsToVersionString = (
  fields: VersionFieldValues,
  withPrefix: boolean,
): string => {
  const major = fields.major === "" ? "1" : fields.major;
  const minor = fields.minor === "" ? "0" : fields.minor;
  const patch = fields.patch === "" ? "0" : fields.patch;
  const numPart = `${major}.${minor}.${patch}`;
  return withPrefix ? `v${numPart}` : numPart;
};

// Segment Input
const VersionSegmentInput = memo(function VersionSegmentInput(
  props: VersionSegmentInputProps,
) {
  // Props
  const {
    fieldKey,
    value,
    disabled = false,
    readOnly = false,
    onValueChange,
    onAutoAdvance,
    onArrowNavigate,
    onStep,
    inputRef,
    onBlur,
  } = props;

  // Handlers
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 3);
    onValueChange(fieldKey, raw);

    if (raw.length === 3) {
      onAutoAdvance(fieldKey);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return;

    if (e.key === "ArrowUp") {
      e.preventDefault();
      onStep(fieldKey, "up");
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      onStep(fieldKey, "down");
      return;
    }

    if (e.key === "." || e.key === "ArrowRight") {
      const { selectionStart, selectionEnd } = e.currentTarget;
      const atEnd =
        selectionStart === value.length && selectionEnd === value.length;
      if (atEnd || e.key === ".") {
        e.preventDefault();
        onArrowNavigate(fieldKey, "right");
      }
      return;
    }

    if (e.key === "ArrowLeft") {
      const { selectionStart, selectionEnd } = e.currentTarget;
      const atStart = selectionStart === 0 && selectionEnd === 0;
      if (atStart) {
        e.preventDefault();
        onArrowNavigate(fieldKey, "left");
      }
      return;
    }

    if (e.key === "Backspace" && value === "") {
      onAutoAdvance(fieldKey);
    }
  };

  return (
    <input
      ref={inputRef as RefObject<HTMLInputElement>}
      type={"text"}
      inputMode={"numeric"}
      pattern={"[0-9]*"}
      value={value}
      disabled={disabled}
      readOnly={readOnly}
      aria-label={`Versi ${fieldKey}`}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onFocus={(e) => e.target.select()}
      onBlur={onBlur}
      style={{
        width: "32px",
        height: "26px",
        textAlign: "center",
        background: "transparent",
        border: "none",
        outline: "none",
        fontWeight: "500",
        fontSize: "14px",
        color: "inherit",
        padding: "0",
        margin: "0",
      }}
    />
  );
});

// VersionInput
export const VersionInput = memo(
  forwardRef<HTMLInputElement, VersionInputProps>(function VersionInput(
    props,
    ref,
  ) {
    // Props
    const {
      name,
      label: propLabel,
      value: controlledValue,
      defaultValue = "1.0.0",
      onChange,
      onValueChange,
      onBlur,
      disabled: propDisabled = false,
      readOnly = false,
      withPrefix = true,
      min = 0,
      max = 999,
      ...restProps
    } = props;

    // Stores
    const { theme } = useThemeStore();

    // Contexts
    const chakraFieldContext = useFieldContext();
    const fieldContext = useFieldContextValue();
    const isFloatingVariant = fieldContext?.variant === "floating";
    const floatingLabel =
      propLabel ?? (isFloatingVariant ? fieldContext?.label : undefined);
    const isOptional = fieldContext?.optional;
    const isFieldInvalid = chakraFieldContext?.invalid;
    const disabled = propDisabled || chakraFieldContext?.disabled;

    // States
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState<string>(
      () => defaultValue ?? "1.0.0",
    );

    const activeValue = isControlled ? (controlledValue ?? "") : internalValue;

    const [fields, setFields] = useState<VersionFieldValues>(() =>
      parseVersionToFields(activeValue),
    );

    // Refs
    const fieldsRef = useRef<VersionFieldValues>(fields);
    fieldsRef.current = fields;

    const prevActiveValueRef = useRef<string>(activeValue);
    if (prevActiveValueRef.current !== activeValue) {
      prevActiveValueRef.current = activeValue;
      const parsed = parseVersionToFields(activeValue);
      fieldsRef.current = parsed;
      setFields(parsed);
    }

    const fieldRefs = useRef<
      Record<VersionFieldKey, RefObject<HTMLInputElement | null>>
    >({
      major: { current: null },
      minor: { current: null },
      patch: { current: null },
    });

    // Handlers
    const emitChange = useCallback(
      (nextFields: VersionFieldValues) => {
        const formatted = fieldsToVersionString(nextFields, withPrefix);
        if (!isControlled) {
          setInternalValue(formatted);
        }
        onValueChange?.(formatted);

        if (onChange) {
          if (typeof onChange === "function") {
            (onChange as (val: string) => void)(formatted);
          }
        }
      },
      [isControlled, onValueChange, onChange, withPrefix],
    );

    const handleFieldChange = useCallback(
      (fieldKey: VersionFieldKey, rawValue: string) => {
        const nextFields = { ...fieldsRef.current, [fieldKey]: rawValue };
        fieldsRef.current = nextFields;
        setFields(nextFields);
        emitChange(nextFields);
      },
      [emitChange],
    );

    const handleAutoAdvance = useCallback((fromField: VersionFieldKey) => {
      const currentIdx = FIELD_ORDER.indexOf(fromField);
      const currentValue = fieldsRef.current[fromField];

      if (currentValue === "") {
        if (currentIdx > 0) {
          const prevField = FIELD_ORDER[currentIdx - 1];
          fieldRefs.current[prevField]?.current?.focus();
        }
        return;
      }

      const nextIdx = currentIdx + 1;
      if (nextIdx < FIELD_ORDER.length) {
        const nextField = FIELD_ORDER[nextIdx];
        fieldRefs.current[nextField]?.current?.focus();
      }
    }, []);

    const handleArrowNavigate = useCallback(
      (fromField: VersionFieldKey, direction: "left" | "right") => {
        const currentIdx = FIELD_ORDER.indexOf(fromField);
        if (direction === "right" && currentIdx < FIELD_ORDER.length - 1) {
          const nextField = FIELD_ORDER[currentIdx + 1];
          fieldRefs.current[nextField]?.current?.focus();
          fieldRefs.current[nextField]?.current?.select();
        } else if (direction === "left" && currentIdx > 0) {
          const prevField = FIELD_ORDER[currentIdx - 1];
          fieldRefs.current[prevField]?.current?.focus();
          fieldRefs.current[prevField]?.current?.select();
        }
      },
      [],
    );

    const handleStep = useCallback(
      (fieldKey: VersionFieldKey, direction: "up" | "down") => {
        const currentNum = parseInt(fieldsRef.current[fieldKey], 10) || 0;
        const nextNum =
          direction === "up"
            ? Math.min(max, currentNum + 1)
            : Math.max(min, currentNum - 1);
        handleFieldChange(fieldKey, String(nextNum));
      },
      [handleFieldChange, max, min],
    );

    const handleContainerClick = (e: MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT") return;
      fieldRefs.current.major?.current?.focus();
    };

    const handleFieldBlur = (e: FocusEvent<HTMLInputElement>) => {
      onBlur?.(e);
    };

    const committedString = fieldsToVersionString(fields, withPrefix);

    const inputCore = (
      <HStack
        align={"center"}
        gap={1}
        border={"1px solid"}
        borderColor={isFieldInvalid ? "border.error" : "border.muted"}
        rounded={theme.radii.component}
        opacity={disabled ? 0.5 : 1}
        pointerEvents={disabled ? "none" : undefined}
        transition={"200ms"}
        px={3}
        h={isFloatingVariant && floatingLabel ? "60px" : 10}
        pt={isFloatingVariant && floatingLabel ? "20px" : "0px"}
        pb={isFloatingVariant && floatingLabel ? "4px" : "0px"}
        w={"full"}
        onClick={handleContainerClick}
        {...restProps}
      >
        {/* Hidden input for RHF form registration */}
        <input
          ref={ref}
          type={"hidden"}
          name={name}
          value={committedString}
          disabled={disabled}
        />

        {withPrefix && (
          <P
            color={"fg.muted"}
            fontWeight={"medium"}
            userSelect={"none"}
            lineHeight={1}
            mr={"2xs"}
          >
            {"v"}
          </P>
        )}

        <HStack align={"center"} gap={1}>
          {FIELD_ORDER.map((fieldKey, idx) => (
            <Fragment key={fieldKey}>
              <VersionSegmentInput
                fieldKey={fieldKey}
                value={fields[fieldKey]}
                disabled={disabled}
                readOnly={readOnly}
                inputRef={fieldRefs.current[fieldKey]}
                onValueChange={handleFieldChange}
                onAutoAdvance={handleAutoAdvance}
                onArrowNavigate={handleArrowNavigate}
                onStep={handleStep}
                onBlur={handleFieldBlur}
              />

              {idx < FIELD_ORDER.length - 1 && (
                <P color={"fg.muted"} lineHeight={1} userSelect={"none"}>
                  {"."}
                </P>
              )}
            </Fragment>
          ))}
        </HStack>
      </HStack>
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
          >
            <HStack align={"center"} gap={2}>
              <ClampedP
                fontSize={"xs"}
                fontWeight={"medium"}
                color={"fg.subtle"}
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

          {inputCore}
        </Box>
      );
    }

    return inputCore;
  }),
);
