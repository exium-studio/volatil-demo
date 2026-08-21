// src/features/mitra/home/components/mitra.home.financial-flow.tsx

import {
  ChartTooltip,
  ChartTooltipContent,
} from "@/design-system/components/charts/ui/chart-tooltip";
import { SegmentGroupInput } from "@/design-system/components/input/ui/segment-group-input";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { P } from "@/design-system/components/typography/ui/p";
import { SPACING } from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/theme-store";
import type { HomePeriod } from "@/features/mitra/home/types/mitra.home.data-summary.type";
import type {
  MitraHomeFinancialFlowChartContentProps,
  MitraHomeFinancialFlowHeaderProps,
  MitraHomeFinancialFlowProps,
} from "@/features/mitra/home/types/mitra.home.financial-flow.type";
import { useMitraHomeData } from "@/features/mitra/home/hooks/use-mitra-home.query";
import { Chart, useChart } from "@chakra-ui/charts";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const PERIOD_OPTIONS = [
  { value: "1d", label: "1H" },
  { value: "1w", label: "1M" },
  { value: "1m", label: "1B" },
  { value: "1y", label: "1T" },
  { value: "all", label: "Semua", flex: 1 },
];

export const MitraHomeFinancialFlow = (props: MitraHomeFinancialFlowProps) => {
  // States
  const [period, setPeriod] = useState<HomePeriod>("all");

  return (
    <Container.Root withContext={true} {...props}>
      <Container.Body gap={8} pt={SPACING.md}>
        <MitraHomeFinancialFlowHeader
          period={period}
          onPeriodChange={setPeriod}
        />

        <VStack mt={"auto"}>
          <MitraHomeFinancialFlowChartContent period={period} />
        </VStack>
      </Container.Body>
    </Container.Root>
  );
};

const MitraHomeFinancialFlowHeader = (
  props: MitraHomeFinancialFlowHeaderProps,
) => {
  // Props
  const { period, onPeriodChange } = props;

  return (
    <HStack
      wrap={"wrap"}
      align={"center"}
      justify={"space-between"}
      gap={SPACING.md}
      px={SPACING.md}
    >
      <HStack gap={SPACING.xs} align={"center"}>
        <P fontSize={"lg"} fontWeight={"semibold"}>
          {"Statistik Alur Keuangan"}
        </P>

        <InfoTip
          variant={"icon"}
          appIconProps={{
            size: "xs",
            color: "fg.subtle",
          }}
        >
          {"Statistik alur keuangan pembelian data Anda"}
        </InfoTip>
      </HStack>

      <SegmentGroupInput
        value={period}
        onValueChange={(e) => onPeriodChange(e.value as HomePeriod)}
        options={PERIOD_OPTIONS}
      />
    </HStack>
  );
};

const MitraHomeFinancialFlowChartContent = (
  props: MitraHomeFinancialFlowChartContentProps,
) => {
  // Props
  const { period } = props;

  // Stores
  const { theme } = useThemeStore();

  // Queries / Data
  const { financialFlow } = useMitraHomeData(period);

  // Derived Values / Hooks
  const chart = useChart({
    data: financialFlow,
    series: [
      { name: "sale", label: "Sale", color: `${theme.colorPalette}.solid` },
    ],
  });

  return (
    <Chart.Root maxH={"256px"} chart={chart} px={SPACING.lg}>
      <ResponsiveContainer width={"100%"} height={240}>
        <AreaChart data={chart.data}>
          <ChartTooltip
            isAnimationActive={false}
            content={<ChartTooltipContent />}
          />

          <defs>
            {chart.series.map((item) => (
              <linearGradient
                key={item.name}
                id={`gradient-${item.name}`}
                x1={"0"}
                y1={"0"}
                x2={"0"}
                y2={"1"}
              >
                <stop
                  offset={"0%"}
                  stopColor={chart.color(item.color)}
                  stopOpacity={0.2}
                />
                <stop
                  offset={"100%"}
                  stopColor={chart.color(item.color)}
                  stopOpacity={0}
                />
              </linearGradient>
            ))}
          </defs>

          <CartesianGrid stroke={chart.color("border")} vertical={false} />

          <XAxis
            axisLine={false}
            dataKey={"label"}
            stroke={chart.color("border")}
            tickMargin={10}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            tickFormatter={(value) =>
              value === 0
                ? ""
                : chart.formatNumber({ notation: "compact" })(value)
            }
            stroke={chart.color("border")}
          />

          {chart.series.map((item) => (
            <Area
              key={item.name}
              type={"linear"}
              isAnimationActive={false}
              dataKey={chart.key(item.name)}
              name={String(item.label ?? "Sale")}
              stroke={chart.color(item.color)}
              strokeWidth={2}
              fill={`url(#gradient-${item.name})`}
              dot={false}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </Chart.Root>
  );
};
