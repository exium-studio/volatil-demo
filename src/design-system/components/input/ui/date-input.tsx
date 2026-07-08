// src/design-system/components/input/ui/date-input.tsx

"use client";

import { CalendarDate } from "@internationalized/date";
import {
  Fragment,
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";

import { IconButton } from "@/design-system/components/button/ui/button";
import { AppTablerIcon } from "@/design-system/components/icon/ui/app-icon";
import type {
  DateInputProps,
  FieldKey,
  FieldValues,
} from "@/design-system/components/input/types/date-input.type";
import type { DateValue } from "@/design-system/components/input/types/date-picker.type";
import { DatePicker } from "@/design-system/components/input/ui/date-picker";
import { Input } from "@/design-system/components/input/ui/input";
import {
  getFieldOrder,
  getMaxLength,
  getPlaceholder,
  parseISODate,
  toISODate,
  validateFromFields,
} from "@/design-system/components/input/utils/date.utils";
import { HStack, VStack } from "@/design-system/components/layout/ui/stack";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { IconCalendarSearch } from "@tabler/icons-react";

// -------------------------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------------------------

const EMPTY_FIELDS: FieldValues = { day: "", month: "", year: "" };

function isoToFields(iso: DateValue): FieldValues {
  if (!iso) return EMPTY_FIELDS;
  const parsed = parseISODate(iso);
  if (!parsed) return EMPTY_FIELDS;
  return {
    day: String(parsed.day).padStart(2, "0"),
    month: String(parsed.month).padStart(2, "0"),
    year: String(parsed.year).padStart(4, "0"),
  };
}

function fieldsToCalendarDate(fields: FieldValues): CalendarDate | null {
  const day = parseInt(fields.day, 10);
  const month = parseInt(fields.month, 10);
  const year = parseInt(fields.year, 10);

  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

  // Reject out-of-range values before constructing —
  // CalendarDate silently normalizes overflow instead of throwing.
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;

  try {
    const cd = new CalendarDate(year, month, day);
    // Detect normalization (e.g. Feb 30 -> Mar 2)
    if (cd.day !== day || cd.month !== month || cd.year !== year) {
      return null;
    }
    return cd;
  } catch {
    return null;
  }
}

// -------------------------------------------------------------------------------------
// FieldInput — a single numeric input part
// -------------------------------------------------------------------------------------

type FieldInputProps = {
  id: string;
  fieldKey: FieldKey;
  value: string;
  disabled?: boolean;
  onValueChange: (field: FieldKey, value: string) => void;
  onAutoAdvance: (fromField: FieldKey) => void;
  onArrowNavigate: (fromField: FieldKey, direction: "left" | "right") => void;
  onBlur: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

const FieldInput = memo(function FieldInput(props: FieldInputProps) {
  // Props
  const {
    id,
    fieldKey,
    value,
    disabled,
    onValueChange,
    onAutoAdvance,
    onArrowNavigate,
    inputRef,
    onBlur,
  } = props;

  // Derived Values
  const maxLen = getMaxLength(fieldKey);
  const placeholder = getPlaceholder(fieldKey);
  const width = fieldKey === "year" ? "52px" : "36px";

  // Handlers
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const rawValue = e.target.value.replace(/\D/g, "").slice(0, maxLen);
    onValueChange(fieldKey, rawValue);

    if (rawValue.length === maxLen) {
      onAutoAdvance(fieldKey);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && value === "") {
      onAutoAdvance(fieldKey); // go back
      return;
    }

    // Only jump fields when the caret is already at the edge of the segment —
    // otherwise let the browser move the caret within the current value normally.
    if (e.key === "ArrowRight") {
      const { selectionStart, selectionEnd } = e.currentTarget;
      const atEnd =
        selectionStart === value.length && selectionEnd === value.length;
      if (atEnd) {
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
    }
  }

  return (
    <Input
      id={id}
      ref={inputRef}
      value={value}
      minW={width}
      w={width}
      maxW={width}
      p={0}
      border={"none"}
      outline={"none"}
      inputMode={"numeric"}
      textAlign={"center"}
      placeholder={placeholder}
      maxLength={maxLen}
      disabled={disabled}
      onChange={handleChange}
      onBlur={onBlur}
      onKeyDown={handleKeyDown}
      aria-label={fieldKey}
    />
  );
});

// -------------------------------------------------------------------------------------
// DateInput
// -------------------------------------------------------------------------------------

export const DateInput = memo(function DateInput(props: DateInputProps) {
  // Props
  const {
    modalKey: propsModalKey = "",
    value: controlledValue,
    defaultValue,
    onValueChange,
    inputFormat = "dmy",
    min,
    max,
    disabledDates,
    timezone,
    locale,
    disabled,
    datePickerSubtitle,
    ...restProps
  } = props;

  // Stores
  const { theme } = useThemeStore();

  // Hooks
  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: propsModalKey,
  });

  // States
  const [internalValue, setInternalValue] = useState<DateValue>(
    () => defaultValue ?? null,
  );

  // Derived Values
  const controlled = controlledValue !== undefined;
  const committedValue = controlled ? (controlledValue ?? null) : internalValue;

  const [fields, setFields] = useState<FieldValues>(() =>
    isoToFields(committedValue),
  );

  // Refs
  const prevCommittedRef = useRef<DateValue>(committedValue);
  if (prevCommittedRef.current !== committedValue) {
    prevCommittedRef.current = committedValue;
    setFields(isoToFields(committedValue));
  }

  // Refs for focus management
  const fieldOrder = useMemo(() => getFieldOrder(inputFormat), [inputFormat]);
  const fieldRefs = useRef<
    Record<FieldKey, React.RefObject<HTMLInputElement | null>>
  >({
    day: { current: null },
    month: { current: null },
    year: { current: null },
  });

  const validationOptions = useMemo(
    () => ({ min, max, disabledDates }),
    [min, max, disabledDates],
  );

  // Commit value from fields
  const commitFields = useCallback(
    (nextFields: FieldValues) => {
      const day = parseInt(nextFields.day, 10);
      const month = parseInt(nextFields.month, 10);
      const year = parseInt(nextFields.year, 10);

      if (isNaN(day) || isNaN(month) || isNaN(year)) {
        return;
      }

      const result = validateFromFields(day, month, year, validationOptions);
      if (!result.valid) return;

      const date = new CalendarDate(year, month, day);
      const iso = toISODate(date);

      if (!controlled) setInternalValue(iso);
      onValueChange?.(iso);
    },
    [controlled, onValueChange, validationOptions],
  );

  // ref mirror of fields, updated synchronously in event handlers
  // so blur (which can fire before React re-renders, e.g. during
  // auto-advance's synchronous .focus() call) always reads the latest value
  const fieldsRef = useRef<FieldValues>(fields);

  // keep ref in sync whenever the render-time reset happens
  if (prevCommittedRef.current !== committedValue) {
    prevCommittedRef.current = committedValue;
    const resetFields = isoToFields(committedValue);
    fieldsRef.current = resetFields;
    setFields(resetFields);
  }

  // Field change handler
  function handleFieldChange(field: FieldKey, rawValue: string) {
    const nextFields = { ...fields, [field]: rawValue };
    fieldsRef.current = nextFields; // sync ref before autoAdvance can trigger a stale blur
    setFields(nextFields);
  }

  // Field on blur — commit using the ref, not the (possibly stale) closure value
  function handleFieldBlur() {
    commitFields(fieldsRef.current);
  }

  // Auto-advance focus
  function handleAutoAdvance(fromField: FieldKey) {
    const currentIdx = fieldOrder.indexOf(fromField);
    const currentValue = fields[fromField];

    // Empty value (after backspace) -> move back, unless already at first field
    if (currentValue === "") {
      if (currentIdx > 0) {
        const prevField = fieldOrder[currentIdx - 1];
        fieldRefs.current[prevField]?.current?.focus();
      }
      return; // always return here, including when at index 0
    }

    // On fill — advance to next
    const nextIdx = currentIdx + 1;
    if (nextIdx < fieldOrder.length) {
      const nextField = fieldOrder[nextIdx];
      fieldRefs.current[nextField].current?.focus();
    }
  }

  // Container click — focus first empty field or last field if all filled
  function handleContainerClick(e: React.MouseEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement;
    if (target.closest("input, button")) return; // don't hijack clicks on field/button

    const emptyField = fieldOrder.find((field) => fields[field] === "");
    const targetField = emptyField ?? fieldOrder[fieldOrder.length - 1];

    fieldRefs.current[targetField]?.current?.focus();
  }

  // Cursor lands at the opposite edge of the field it enters — feels like
  // continuous typing across segments instead of a jarring reset.
  function handleArrowNavigate(
    fromField: FieldKey,
    direction: "left" | "right",
  ) {
    const currentIdx = fieldOrder.indexOf(fromField);
    const targetIdx = direction === "right" ? currentIdx + 1 : currentIdx - 1;

    // Already at the first/last field — no field to jump to, stay put.
    if (targetIdx < 0 || targetIdx >= fieldOrder.length) return;

    const targetField = fieldOrder[targetIdx];
    const targetInput = fieldRefs.current[targetField]?.current;
    if (!targetInput) return;

    targetInput.focus();
    const caretPos = direction === "right" ? 0 : targetInput.value.length;
    targetInput.setSelectionRange(caretPos, caretPos);
  }

  // Derive inline validation state for field border
  const isFieldsValid = useMemo(() => {
    const cd = fieldsToCalendarDate(fields);
    if (!cd)
      // if fields empty will return true
      return fields.day === "" && fields.month === "" && fields.year === "";
    const result = validateFromFields(
      cd.day,
      cd.month,
      cd.year,
      validationOptions,
    );
    return result.valid;
  }, [fields, validationOptions]);

  //   const hasPartialInput =
  //     fields.day !== "" || fields.month !== "" || fields.year !== "";

  const showError = !isFieldsValid;

  return (
    <HStack
      justify={"space-between"}
      gap={1}
      border={"1px solid"}
      borderColor={showError ? "red.solid" : "neutral.muted"}
      rounded={theme.radii.component}
      opacity={disabled ? 0.5 : 1}
      pointerEvents={disabled ? "none" : undefined}
      transition={"200ms"}
      px={2}
      h={10}
      onClick={handleContainerClick}
      {...restProps}
    >
      <HStack flex={1} align={"center"}>
        {fieldOrder.map((field, idx) => (
          <Fragment key={field}>
            <FieldInput
              id={`${modalKey}-${field}`}
              fieldKey={field}
              value={fields[field]}
              disabled={disabled}
              onValueChange={handleFieldChange}
              onAutoAdvance={handleAutoAdvance}
              onArrowNavigate={handleArrowNavigate}
              onBlur={handleFieldBlur}
              inputRef={fieldRefs.current[field]}
            />

            {idx < fieldOrder.length - 1 && (
              <P color="fg.muted" lineHeight={1} userSelect="none">
                -
              </P>
            )}
          </Fragment>
        ))}
      </HStack>

      {modalKey && (
        <Modal.Root
          modalKey={modalKey}
          opened={isOpen}
          open={open}
          close={close}
          size={"sm"}
        >
          <Modal.Trigger>
            <IconButton
              size={"xs"}
              variant={"ghost"}
              aspectRatio={"square"}
              mr={-1}
              my={"auto"}
              aria-label={"Open date picker"}
            >
              <AppTablerIcon icon={IconCalendarSearch} />
            </IconButton>
          </Modal.Trigger>

          <Modal.Content>
            <Modal.Header>
              <VStack gap={1} mx={"auto"}>
                <P fontWeight={"semibold"} textAlign={"center"}>
                  Select Date
                </P>

                {/* TODO: make the subtitle dynamic based on props */}
                {datePickerSubtitle && (
                  <P fontSize={"sm"} textAlign={"center"} color={"fg.muted"}>
                    {datePickerSubtitle}
                  </P>
                )}
              </VStack>

              <Modal.CloseButton mb={"auto"} />
            </Modal.Header>

            <Modal.Body pt={0}>
              <DatePicker
                value={committedValue}
                onValueChange={(value) => {
                  setInternalValue(value);
                  close();
                }}
                min={min}
                max={max}
                disabledDates={disabledDates}
                timezone={timezone}
                locale={locale}
                inputFormat={inputFormat}
              />
            </Modal.Body>
          </Modal.Content>
        </Modal.Root>
      )}
    </HStack>
  );
});
