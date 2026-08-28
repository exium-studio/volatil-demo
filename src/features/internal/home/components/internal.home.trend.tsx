// src/features/internal/home/components/internal.home.trend.tsx

import {
  ChartTooltip,
  ChartTooltipContent,
} from "@/design-system/components/charts/ui/chart-tooltip";
import { SegmentGroupInput } from "@/design-system/components/input/ui/segment-group-input";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { useInternalHomeData } from "@/features/internal/home/hooks/use-internal-home.query";
import type {
  InternalHomeTrendChartProps,
  InternalHomeTrendHeaderProps,
  InternalHomeTrendProps,
} from "@/features/internal/home/types/internal.home.trend.type";
import type { HomePeriod } from "@/features/mitra/home/types/mitra.home.data-summary.type";
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

export const InternalHomeTrend = (props: InternalHomeTrendProps) => {
  // States
  const [period, setPeriod] = useState<HomePeriod>("all");

  return (
    <Container.Root withContext={true} flex={"1 1 100%"} {...props}>
      <Container.Body gap={8} pt={"md"} pb={"md"}>
        <InternalHomeTrendHeader period={period} onPeriodChange={setPeriod} />

        <VStack mt={"auto"}>
          <InternalHomeTrendChartContent period={period} />
        </VStack>
      </Container.Body>
    </Container.Root>
  );
};

const InternalHomeTrendHeader = (props: InternalHomeTrendHeaderProps) => {
  // Props
  const { period, onPeriodChange } = props;

  return (
    <HStack
      wrap={"wrap"}
      align={"center"}
      justify={"space-between"}
      gap={"md"}
      px={"md"}
    >
      <HStack gap={"xs"} align={"center"}>
        <Heading>{"Tren Akuisisi Data IGT"}</Heading>

        <InfoTip
          variant={"icon"}
          appIconProps={{
            size: "xs",
            color: "fg.subtle",
          }}
        >
          {
            "Tren dinamika volume akuisisi data IGT Bidang, Kawasan, dan estimasi penerimaan PNBP"
          }
        </InfoTip>
      </HStack>

      <SegmentGroupInput
        size={"xs"}
        value={period}
        onValueChange={(e) => onPeriodChange(e.value as HomePeriod)}
        options={PERIOD_OPTIONS}
      />
    </HStack>
  );
};

const InternalHomeTrendChartContent = (props: InternalHomeTrendChartProps) => {
  // Props
  const { period } = props;

  // Queries / Data
  const { acquisitionTrends } = useInternalHomeData(period);

  // Derived Values / Hooks
  const chart = useChart({
    data: acquisitionTrends,
    series: [
      { name: "field", label: "Bidang (Objek)", color: "blue.solid" },
      { name: "area", label: "Kawasan (Ha)", color: "orange.solid" },
    ],
  });

  return (
    <Chart.Root maxH={"280px"} chart={chart} px={"lg"}>
      <ResponsiveContainer width={"100%"} height={260}>
        <AreaChart data={chart.data}>
          <ChartTooltip
            isAnimationActive={false}
            content={<ChartTooltipContent />}
          />

          <defs>
            {chart.series.map((item) => (
              <linearGradient
                key={item.name}
                id={`internal-gradient-${item.name}`}
                x1={"0"}
                y1={"0"}
                x2={"0"}
                y2={"1"}
              >
                <stop
                  offset={"0%"}
                  stopColor={chart.color(item.color)}
                  stopOpacity={0.25}
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
              type={"monotone"}
              isAnimationActive={false}
              dataKey={chart.key(item.name)}
              name={String(item.label ?? item.name)}
              stroke={chart.color(item.color)}
              strokeWidth={2.5}
              fill={`url(#internal-gradient-${item.name})`}
              dot={false}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </Chart.Root>
  );
};
