// src/design-system/components/charts/types/chart-tooltip.type.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { TooltipProps } from "recharts";
import type {
  NameType,
  Payload,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

export type ChartTooltipProps = TooltipProps<ValueType, NameType>;

type RechartsTooltipProps = {
  active?: boolean;
  label?: string;
  payload?: Payload<ValueType, NameType>[];
};

export type ChartTooltipContentProps = StackProps & RechartsTooltipProps;
