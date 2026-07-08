// src/design-system/components/input/ui/chakra-date-picker.tsx

import {
  DatePicker as ChakraDatePicker,
  type DatePickerDayTableProps,
  type DatePickerMonthTableProps,
} from "@chakra-ui/react";

import type {
  DatePickerRootProps,
  DatePickerLabelProps,
  DatePickerControlProps,
  DatePickerInputProps,
  DatePickerIndicatorGroupProps,
  DatePickerTriggerProps,
  DatePickerClearTriggerProps,
  DatePickerPositionerProps,
  DatePickerContentProps,
  DatePickerViewProps,
  DatePickerViewControlProps,
  DatePickerPrevTriggerProps,
  DatePickerViewTriggerProps,
  DatePickerRangeTextProps,
  DatePickerNextTriggerProps,
  DatePickerTableProps,
  DatePickerTableHeadProps,
  DatePickerTableRowProps,
  DatePickerTableHeaderProps,
  DatePickerTableBodyProps,
  DatePickerTableCellProps,
  DatePickerTableCellTriggerProps,
  DatePickerMonthSelectProps,
  DatePickerYearSelectProps,
  DatePickerPresetTriggerProps,
  DatePickerHeaderProps,
  DatePickerYearTableProps,
} from "@/design-system/components/input/types/chakra-date-picker.type";
import { useThemeStore } from "@/design-system/stores/use-theme-store";

const DatePickerRoot = ({ ...props }: DatePickerRootProps) => {
  return <ChakraDatePicker.Root {...props} />;
};

const DatePickerLabel = ({ ...props }: DatePickerLabelProps) => {
  return <ChakraDatePicker.Label {...props} />;
};

const DatePickerControl = ({ ...props }: DatePickerControlProps) => {
  return <ChakraDatePicker.Control {...props} />;
};

const DatePickerInput = ({ ...props }: DatePickerInputProps) => {
  // Stores
  const { theme } = useThemeStore();

  return <ChakraDatePicker.Input rounded={theme.radii.component} {...props} />;
};

const DatePickerIndicatorGroup = ({
  ...props
}: DatePickerIndicatorGroupProps) => {
  return <ChakraDatePicker.IndicatorGroup {...props} />;
};

const DatePickerTrigger = ({ ...props }: DatePickerTriggerProps) => {
  return <ChakraDatePicker.Trigger {...props} />;
};

const DatePickerClearTrigger = ({ ...props }: DatePickerClearTriggerProps) => {
  return <ChakraDatePicker.ClearTrigger {...props} />;
};

const DatePickerPositioner = ({ ...props }: DatePickerPositionerProps) => {
  return <ChakraDatePicker.Positioner {...props} />;
};

const DatePickerContent = ({ ...props }: DatePickerContentProps) => {
  // Stores
  const { theme } = useThemeStore();

  return (
    <ChakraDatePicker.Content
      bg={"bg.body"}
      rounded={theme.radii.container}
      border={"1px solid"}
      borderColor={"border.subtle"}
      shadow={"md"}
      {...props}
    />
  );
};

const DatePickerView = ({ ...props }: DatePickerViewProps) => {
  return <ChakraDatePicker.View {...props} />;
};

const DatePickerHeader = ({ ...props }: DatePickerHeaderProps) => {
  return <ChakraDatePicker.Header {...props} />;
};

const DatePickerDayTable = ({ ...props }: DatePickerDayTableProps) => {
  return <ChakraDatePicker.DayTable {...props} />;
};

const DatePickerMonthTable = ({ ...props }: DatePickerMonthTableProps) => {
  return <ChakraDatePicker.MonthTable {...props} />;
};

const DatePickerYearTable = ({ ...props }: DatePickerYearTableProps) => {
  return <ChakraDatePicker.YearTable {...props} />;
};

const DatePickerViewControl = ({ ...props }: DatePickerViewControlProps) => {
  return <ChakraDatePicker.ViewControl {...props} />;
};

const DatePickerPrevTrigger = ({ ...props }: DatePickerPrevTriggerProps) => {
  return <ChakraDatePicker.PrevTrigger {...props} />;
};

const DatePickerViewTrigger = ({ ...props }: DatePickerViewTriggerProps) => {
  return <ChakraDatePicker.ViewTrigger {...props} />;
};

const DatePickerRangeText = ({ ...props }: DatePickerRangeTextProps) => {
  return <ChakraDatePicker.RangeText {...props} />;
};

const DatePickerNextTrigger = ({ ...props }: DatePickerNextTriggerProps) => {
  return <ChakraDatePicker.NextTrigger {...props} />;
};

const DatePickerTable = ({ ...props }: DatePickerTableProps) => {
  return <ChakraDatePicker.Table {...props} />;
};

const DatePickerTableHead = ({ ...props }: DatePickerTableHeadProps) => {
  return <ChakraDatePicker.TableHead {...props} />;
};

const DatePickerTableRow = ({ ...props }: DatePickerTableRowProps) => {
  return <ChakraDatePicker.TableRow {...props} />;
};

const DatePickerTableHeader = ({ ...props }: DatePickerTableHeaderProps) => {
  return <ChakraDatePicker.TableHeader {...props} />;
};

const DatePickerTableBody = ({ ...props }: DatePickerTableBodyProps) => {
  return <ChakraDatePicker.TableBody {...props} />;
};

const DatePickerTableCell = ({ ...props }: DatePickerTableCellProps) => {
  return <ChakraDatePicker.TableCell {...props} />;
};

const DatePickerTableCellTrigger = ({
  ...props
}: DatePickerTableCellTriggerProps) => {
  return <ChakraDatePicker.TableCellTrigger {...props} />;
};

const DatePickerMonthSelect = ({ ...props }: DatePickerMonthSelectProps) => {
  return <ChakraDatePicker.MonthSelect {...props} />;
};

const DatePickerYearSelect = ({ ...props }: DatePickerYearSelectProps) => {
  return <ChakraDatePicker.YearSelect {...props} />;
};

const DatePickerPresetTrigger = ({
  ...props
}: DatePickerPresetTriggerProps) => {
  return <ChakraDatePicker.PresetTrigger {...props} />;
};

export const DatePicker = {
  Root: DatePickerRoot,
  Label: DatePickerLabel,
  Control: DatePickerControl,
  Input: DatePickerInput,
  IndicatorGroup: DatePickerIndicatorGroup,
  Trigger: DatePickerTrigger,
  ClearTrigger: DatePickerClearTrigger,
  Positioner: DatePickerPositioner,
  Content: DatePickerContent,
  View: DatePickerView,
  Header: DatePickerHeader,
  DayTable: DatePickerDayTable,
  MonthTable: DatePickerMonthTable,
  YearTable: DatePickerYearTable,
  ViewControl: DatePickerViewControl,
  PrevTrigger: DatePickerPrevTrigger,
  ViewTrigger: DatePickerViewTrigger,
  RangeText: DatePickerRangeText,
  NextTrigger: DatePickerNextTrigger,
  Table: DatePickerTable,
  TableHead: DatePickerTableHead,
  TableRow: DatePickerTableRow,
  TableHeader: DatePickerTableHeader,
  TableBody: DatePickerTableBody,
  TableCell: DatePickerTableCell,
  TableCellTrigger: DatePickerTableCellTrigger,
  MonthSelect: DatePickerMonthSelect,
  YearSelect: DatePickerYearSelect,
  PresetTrigger: DatePickerPresetTrigger,
};
