// src/design-system/components/input/ui/date-picker.tsx

import { CalendarDate } from "@internationalized/date";
import { memo, useCallback, useMemo, useState } from "react";

import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import { AppTablerIcon } from "@/design-system/components/icon/ui/app-icon";
import type { DatePickerProps } from "@/design-system/components/input/types/date-picker.type";
import {
  buildCalendarGrid,
  buildTimezoneLabel,
  buildYearPage,
  getTodayDate,
  getYearPageStart,
  MONTHS,
  MONTHS_SHORT,
  parseISODate,
  resolveTimezone,
  toISODate,
  validateDate,
  WEEKDAYS_HEADER,
  YEAR_PAGE_SIZE,
} from "@/design-system/components/input/utils/date.utils";
import { Grid } from "@/design-system/components/layout/ui/grid";
import { HStack, VStack } from "@/design-system/components/layout/ui/stack";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import {
  IconChevronLeft,
  IconChevronRight,
  IconWorld,
} from "@tabler/icons-react";

type View = "day" | "month" | "year";

// -------------------------------------------------------------------------------------
// Hook: useDatePickerState
// -------------------------------------------------------------------------------------

function useDatePickerState(props: DatePickerProps) {
  const {
    value,
    defaultValue,
    onValueChange,
    min,
    max,
    disabledDates,
    timezone,
  } = props;

  const controlled = value !== undefined;
  const tz = useMemo(() => resolveTimezone(timezone), [timezone]);
  const todayDate = useMemo(() => getTodayDate(tz), [tz]);

  // Uncontrolled fallback value
  const [internalValue, setInternalValue] = useState<CalendarDate | null>(() =>
    parseISODate(defaultValue),
  );

  const selectedDate = useMemo<CalendarDate | null>(() => {
    if (controlled) return parseISODate(value);
    return internalValue;
  }, [controlled, internalValue, value]);

  // View state
  const [viewDate, setViewDate] = useState<CalendarDate>(
    () => selectedDate ?? todayDate,
  );
  const [view, setView] = useState<View>("day");

  // Validation constraints
  const validationOptions = useMemo(
    () => ({ min, max, disabledDates }),
    [min, max, disabledDates],
  );

  const isDateDisabled = useCallback(
    (date: CalendarDate): boolean =>
      !validateDate(date, validationOptions).valid,
    [validationOptions],
  );

  // Selecting a day commits immediately — no intermediate confirm step
  function selectDate(date: CalendarDate) {
    if (isDateDisabled(date)) return;

    if (!controlled) {
      setInternalValue(date);
    }
    onValueChange?.(toISODate(date));
  }

  return {
    selectedDate,
    viewDate,
    view,
    todayDate,
    tz,
    isDateDisabled,
    selectDate,
    setViewDate,
    setView,
  };
}

// -------------------------------------------------------------------------------------
// Nav Header
// -------------------------------------------------------------------------------------

type NavHeaderProps = {
  label: string;
  onPrev: () => void;
  onNext: () => void;
  onLabelClick?: () => void;
  labelClickable?: boolean;
};

const NavHeader = memo(function NavHeader({
  label,
  onPrev,
  onNext,
  onLabelClick,
  labelClickable = false,
}: NavHeaderProps) {
  return (
    <HStack justify={"space-between"} align={"center"} gap={1} py={1}>
      <IconButton variant={"ghost"} aria-label={"Previous"} onClick={onPrev}>
        <AppTablerIcon icon={IconChevronLeft} />
      </IconButton>

      <Button
        flex={1}
        cursor={labelClickable ? "pointer" : "default"}
        bg={labelClickable ? "" : "none"}
        userSelect={"none"}
        onClick={labelClickable ? onLabelClick : undefined}
      >
        {label}
      </Button>

      <IconButton variant={"ghost"} aria-label={"Next"} onClick={onNext}>
        <AppTablerIcon icon={IconChevronRight} />
      </IconButton>
    </HStack>
  );
});

// -------------------------------------------------------------------------------------
// Day View
// -------------------------------------------------------------------------------------

type DayViewProps = {
  viewDate: CalendarDate;
  selectedDate: CalendarDate | null;
  todayDate: CalendarDate;
  isDateDisabled: (date: CalendarDate) => boolean;
  onSelectDay: (date: CalendarDate) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onGoToMonthView: () => void;
};

const DayView = memo(function DayView({
  viewDate,
  selectedDate,
  todayDate,
  isDateDisabled,
  onSelectDay,
  onPrevMonth,
  onNextMonth,
  onGoToMonthView,
}: DayViewProps) {
  // Stores
  const { theme } = useThemeStore();

  // Resolved Values
  const grid = useMemo(
    () => buildCalendarGrid(viewDate.year, viewDate.month),
    [viewDate.year, viewDate.month],
  );

  const label = `${MONTHS[viewDate.month - 1]} ${viewDate.year}`;

  return (
    <VStack gap={4}>
      <NavHeader
        label={label}
        onPrev={onPrevMonth}
        onNext={onNextMonth}
        onLabelClick={onGoToMonthView}
        labelClickable
      />

      {/* Calendar grid */}
      <VStack gap={2}>
        {/* Day-of-week header */}
        <HStack justify={"space-between"}>
          {WEEKDAYS_HEADER.map((d, index) => (
            <P
              key={index}
              w={"40px"}
              color={"fg.muted"}
              fontWeight={"medium"}
              textAlign={"center"}
            >
              {d}
            </P>
          ))}
        </HStack>

        {grid.map((week, wi) => (
          <HStack key={wi} justify={"space-between"}>
            {week.map((cell) => {
              const iso = toISODate(cell.date);
              const isSelected = selectedDate
                ? toISODate(selectedDate) === iso
                : false;
              const isToday = toISODate(todayDate) === iso;
              const disabled = isDateDisabled(cell.date);
              const dimmed = !cell.isCurrentMonth;

              return (
                <Button
                  key={iso}
                  variant={isSelected ? "subtle" : "ghost"}
                  w={"40px"}
                  h={"40px"}
                  p={0}
                  rounded={theme.radii.component}
                  opacity={dimmed && !isSelected ? 0.35 : disabled ? 0.35 : 1}
                  tabIndex={disabled ? -1 : 0}
                  disabled={disabled}
                  onClick={() => !disabled && onSelectDay(cell.date)}
                  onKeyDown={(e: React.KeyboardEvent) => {
                    if ((e.key === "Enter" || e.key === " ") && !disabled) {
                      onSelectDay(cell.date);
                    }
                  }}
                  aria-label={iso}
                  aria-pressed={isSelected}
                  aria-disabled={disabled}
                >
                  <P
                    fontWeight={isToday || isSelected ? "bold" : "normal"}
                    lineHeight={1}
                    py={1}
                    borderBottom={"2px solid"}
                    borderColor={
                      isToday ? `${theme.colorPalette}.solid` : "transparent"
                    }
                  >
                    {cell.date.day}
                  </P>
                </Button>
              );
            })}
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
});

// -------------------------------------------------------------------------------------
// Month View
// -------------------------------------------------------------------------------------

type MonthViewProps = {
  viewDate: CalendarDate;
  onSelectMonth: (month: number) => void;
  onPrevYear: () => void;
  onNextYear: () => void;
  onGoToYearView: () => void;
};

const MonthView = memo(function MonthView({
  viewDate,
  onSelectMonth,
  onPrevYear,
  onNextYear,
  onGoToYearView,
}: MonthViewProps) {
  const { theme } = useThemeStore();

  return (
    <VStack gap={2}>
      <NavHeader
        label={String(viewDate.year)}
        onPrev={onPrevYear}
        onNext={onNextYear}
        onLabelClick={onGoToYearView}
        labelClickable
      />

      <Grid gridTemplateColumns={"repeat(3, 1fr)"} gap={1}>
        {MONTHS_SHORT.map((name, i) => {
          const monthNum = i + 1;
          const isActive = viewDate.month === monthNum;

          return (
            <Button
              key={name}
              h={"40px"}
              rounded={theme.radii.component}
              variant={isActive ? "subtle" : "ghost"}
              onClick={() => onSelectMonth(monthNum)}
              aria-label={name}
              aria-pressed={isActive}
            >
              <P fontWeight={isActive ? "bold" : "normal"}>{name}</P>
            </Button>
          );
        })}
      </Grid>
    </VStack>
  );
});

// -------------------------------------------------------------------------------------
// Year View
// -------------------------------------------------------------------------------------

type YearViewProps = {
  viewDate: CalendarDate;
  onSelectYear: (year: number) => void;
  yearPageStart: number;
  onPrevPage: () => void;
  onNextPage: () => void;
};

const YearView = memo(function YearView({
  viewDate,
  onSelectYear,
  yearPageStart,
  onPrevPage,
  onNextPage,
}: YearViewProps) {
  const { theme } = useThemeStore();
  const years = useMemo(() => buildYearPage(yearPageStart), [yearPageStart]);

  const label = `${yearPageStart} - ${yearPageStart + YEAR_PAGE_SIZE - 1}`;

  return (
    <VStack gap={2}>
      <NavHeader label={label} onPrev={onPrevPage} onNext={onNextPage} />

      <Grid gridTemplateColumns={"repeat(4, 1fr)"} gap={1}>
        {years.map((y) => {
          const isActive = viewDate.year === y;

          return (
            <Button
              key={y}
              variant={isActive ? "subtle" : "ghost"}
              rounded={theme.radii.component}
              onClick={() => onSelectYear(y)}
              aria-label={String(y)}
              aria-pressed={isActive}
            >
              <P fontWeight={isActive ? "bold" : "normal"}>{y}</P>
            </Button>
          );
        })}
      </Grid>
    </VStack>
  );
});

// -------------------------------------------------------------------------------------
// DatePicker (public)
// -------------------------------------------------------------------------------------

export const DatePicker = memo(function DatePicker(props: DatePickerProps) {
  // Props
  const {
    value,
    defaultValue,
    onValueChange,
    min,
    max,
    disabledDates,
    timezone,
    disabled,
    locale: _locale,
    inputFormat: _inputFormat,
    ...restProps
  } = props;

  // Stores
  const { theme } = useThemeStore();

  // Hooks
  const {
    selectedDate,
    viewDate,
    view,
    todayDate,
    tz,
    isDateDisabled,
    selectDate,
    setViewDate,
    setView,
  } = useDatePickerState({
    value,
    defaultValue,
    onValueChange,
    min,
    max,
    disabledDates,
    timezone,
  });

  const [yearPageStart, setYearPageStart] = useState(() =>
    getYearPageStart(viewDate.year),
  );

  // Keep year page in sync with view when switching
  const [prevView, setPrevView] = useState(view);
  if (prevView !== view) {
    setPrevView(view);
    if (view === "year") {
      setYearPageStart(getYearPageStart(viewDate.year));
    }
  }

  // Navigation helpers
  function prevMonth() {
    setViewDate((v) =>
      v.month === 1
        ? v.set({ year: v.year - 1, month: 12 })
        : v.set({ month: v.month - 1 }),
    );
  }
  function nextMonth() {
    setViewDate((v) =>
      v.month === 12
        ? v.set({ year: v.year + 1, month: 1 })
        : v.set({ month: v.month + 1 }),
    );
  }

  function prevYear() {
    setViewDate((v) => v.set({ year: v.year - 1 }));
  }
  function nextYear() {
    setViewDate((v) => v.set({ year: v.year + 1 }));
  }

  function prevYearPage() {
    setYearPageStart((p) => p - YEAR_PAGE_SIZE);
  }
  function nextYearPage() {
    setYearPageStart((p) => p + YEAR_PAGE_SIZE);
  }

  function handleSelectMonth(month: number) {
    setViewDate((v) => v.set({ month }));
    setView("day");
  }

  function handleSelectYear(year: number) {
    setViewDate((v) => v.set({ year }));
    setView("month");
  }

  function goToToday() {
    setViewDate(todayDate);
    setView("day");
  }

  const timezoneLabel = useMemo(() => buildTimezoneLabel(tz), [tz]);

  return (
    <VStack
      overflow={"hidden"}
      w={"full"}
      rounded={theme.radii.container}
      opacity={disabled ? 0.5 : 1}
      pointerEvents={disabled ? "none" : undefined}
      {...restProps}
    >
      {/* Calendar body */}
      <VStack gap={4} w={"full"}>
        {view === "day" && (
          <DayView
            viewDate={viewDate}
            selectedDate={selectedDate}
            todayDate={todayDate}
            isDateDisabled={isDateDisabled}
            onSelectDay={selectDate}
            onPrevMonth={prevMonth}
            onNextMonth={nextMonth}
            onGoToMonthView={() => setView("month")}
          />
        )}

        {view === "month" && (
          <MonthView
            viewDate={viewDate}
            onSelectMonth={handleSelectMonth}
            onPrevYear={prevYear}
            onNextYear={nextYear}
            onGoToYearView={() => setView("year")}
          />
        )}

        {view === "year" && (
          <YearView
            viewDate={viewDate}
            onSelectYear={handleSelectYear}
            yearPageStart={yearPageStart}
            onPrevPage={prevYearPage}
            onNextPage={nextYearPage}
          />
        )}

        <HStack align={"center"} justify={"space-between"}>
          <HStack align={"center"} gap={2} color={"fg.muted"}>
            <AppTablerIcon icon={IconWorld} size={"sm"} />

            <ClampedP fontSize={"sm"}>{timezoneLabel}</ClampedP>
          </HStack>

          <Button
            unstyled
            fontSize={"sm"}
            cursor={"pointer"}
            userSelect={"none"}
            onClick={goToToday}
          >
            <P>Go to today</P>
          </Button>
        </HStack>
      </VStack>
    </VStack>
  );
});
