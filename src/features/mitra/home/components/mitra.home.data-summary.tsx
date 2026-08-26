// src/features/mitra/home/components/mitra.home.data-summary.tsx

import { StatGrid } from "@/design-system/components/data-display/ui/stat-grid";
import type { ProgressRootProps } from "@/design-system/components/feedback/types/progress.type";
import { Progress } from "@/design-system/components/feedback/ui/progress";
import { SegmentGroupInput } from "@/design-system/components/input/ui/segment-group-input";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { Box } from "@/design-system/components/layout/ui/box";
import {
  Container,
  useContainerContext,
} from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { SimpleGrid } from "@/design-system/components/layout/ui/grid";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { P } from "@/design-system/components/typography/ui/p";
import { useMitraHomeData } from "@/features/mitra/home/hooks/use-mitra-home.query";
import type {
  HomePeriod,
  MitraHomeDataSummaryChartsProps,
  MitraHomeDataSummaryHeaderProps,
  MitraHomeDataSummaryLegendProps,
  MitraHomeDataSummaryProps,
  MitraHomeDataSummaryStatusConfig,
} from "@/features/mitra/home/types/mitra.home.data-summary.type";
import { useState } from "react";

const PERIOD_OPTIONS = [
  { value: "1d", label: "1H" },
  { value: "1w", label: "1M" },
  { value: "1m", label: "1B" },
  { value: "1y", label: "1T" },
  { value: "all", label: "Semua", flex: 1 },
];

export const MitraHomeDataSummary = (props: MitraHomeDataSummaryProps) => {
  // States
  const [period, setPeriod] = useState<HomePeriod>("all");

  return (
    <Container.Root withContext={true} {...props}>
      <Container.Body gap={4} py={"md"}>
        <MitraHomeDataSummaryHeader
          period={period}
          onPeriodChange={setPeriod}
        />

        <Separator borderColor={"bg.canvas"} />

        <MitraHomeDataSummaryCharts period={period} />
      </Container.Body>
    </Container.Root>
  );
};

const MitraHomeDataSummaryHeader = (props: MitraHomeDataSummaryHeaderProps) => {
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
        <Heading>{"Ringkasan Data Anda"}</Heading>

        <InfoTip
          variant={"icon"}
          appIconProps={{
            size: "xs",
            color: "fg.subtle",
          }}
        >
          {"Ringkasan informasi status data IGT Anda."}
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

const FIELD_STATUSES: MitraHomeDataSummaryStatusConfig[] = [
  {
    key: "active",
    label: "Aktif",
    colorPalette: "blue",
    legendColor: "blue.solid",
    striped: true,
  },
  {
    key: "almostExpired",
    label: "Hampir kadaluwarsa",
    bg: "an4",
    legendColor: "an4",
    striped: false,
  },
  {
    key: "expired",
    label: "Kadaluwarsa",
    bg: "an2",
    legendColor: "an2",
    striped: false,
  },
];

const AREA_STATUSES: MitraHomeDataSummaryStatusConfig[] = [
  {
    key: "active",
    label: "Aktif",
    colorPalette: "orange",
    legendColor: "orange.solid",
    striped: true,
  },
  {
    key: "almostExpired",
    label: "Hampir kadaluwarsa",
    bg: "an4",
    legendColor: "an4",
    striped: false,
  },
  {
    key: "expired",
    label: "Kadaluwarsa",
    bg: "an2",
    legendColor: "an2",
    striped: false,
  },
];

const MitraHomeDataSummaryCharts = (props: MitraHomeDataSummaryChartsProps) => {
  // Props
  const { period } = props;

  // Contexts
  const { isSmContainer } = useContainerContext();

  // Queries / Data for current period
  const { dataSummary } = useMitraHomeData(period);

  return (
    <SimpleGrid
      columns={isSmContainer ? 1 : 2}
      gap={"md"}
      px={"md"}
    >
      {/* IGT Berbasis Bidang */}
      <VStack align={"start"} gap={"md"}>
        <P color={"fg.muted"}>{"IGT berbasis bidang"}</P>

        <HStack gap={"xs"} w={"full"}>
          {FIELD_STATUSES.map((config) => {
            const value = dataSummary.field[config.key];

            return (
              <ProgressBar
                key={config.key}
                striped={config.striped}
                colorPalette={config.colorPalette}
                bg={config.bg}
                flex={value}
              />
            );
          })}
        </HStack>

        <HStack wrap={"wrap"} gap={6}>
          {FIELD_STATUSES.map((config) => {
            const value = dataSummary.field[config.key];
            return (
              <MitraHomeDataSummaryLegend
                key={config.key}
                legendColor={config.legendColor}
                label={config.label}
                value={value}
              />
            );
          })}
        </HStack>
      </VStack>

      {/* IGT Berbasis Kawasan */}
      <VStack align={"start"} gap={"md"}>
        <P color={"fg.muted"}>{"IGT berbasis kawasan"}</P>

        <HStack gap={"xs"} w={"full"}>
          {AREA_STATUSES.map((config) => {
            const value = dataSummary.area[config.key];
            return (
              <ProgressBar
                key={config.key}
                striped={config.striped}
                colorPalette={config.colorPalette}
                bg={config.bg}
                flex={value}
              />
            );
          })}
        </HStack>

        <HStack wrap={"wrap"} gap={6}>
          {AREA_STATUSES.map((config) => {
            const value = dataSummary.area[config.key];
            return (
              <MitraHomeDataSummaryLegend
                key={config.key}
                legendColor={config.legendColor}
                label={config.label}
                value={value}
              />
            );
          })}
        </HStack>
      </VStack>
    </SimpleGrid>
  );
};

const ProgressBar = (props: ProgressRootProps) => {
  return (
    <Progress.Root value={100} size={"xl"} flex={1} {...props}>
      <Progress.Track shadow={"none"}>
        <Progress.Range bg={props.bg} />
      </Progress.Track>
    </Progress.Root>
  );
};

const MitraHomeDataSummaryLegend = (props: MitraHomeDataSummaryLegendProps) => {
  // Props
  const { legendColor, label, value, ...restProps } = props;

  return (
    <HStack align={"start"} gap={2} {...restProps}>
      <Box w={"8px"} h={"8px"} bg={legendColor} mt={2} />

      <Box>
        <P color={"fg.muted"}>{label}</P>

        <StatGrid.Value>{value}</StatGrid.Value>
      </Box>
    </HStack>
  );
};
