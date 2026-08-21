// src/features/internal/home/components/internal.home.data-summary.tsx

import { Progress } from "@/design-system/components/feedback/ui/progress";
import { SegmentGroupInput } from "@/design-system/components/input/ui/segment-group-input";
import { Box } from "@/design-system/components/layout/ui/box";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { SimpleGrid } from "@/design-system/components/layout/ui/grid";
import { P } from "@/design-system/components/typography/ui/p";
import { Span } from "@/design-system/components/typography/ui/span";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { SPACING } from "@/design-system/constants/styles";
import type {
  DataSummaryStatusConfig,
  InternalHomeDataSummaryChartsProps,
  InternalHomeDataSummaryHeaderProps,
  InternalHomeDataSummaryLegendProps,
  InternalHomeDataSummaryProps,
} from "@/features/internal/home/types/internal.home.data-summary.type";
import type { HomePeriod } from "@/features/mitra/home/types/mitra.home.data-summary.type";
import { useInternalHomeData } from "@/features/internal/home/hooks/use-internal-home.query";
import { useState } from "react";

const PERIOD_OPTIONS = [
  { value: "1d", label: "1H" },
  { value: "1w", label: "1M" },
  { value: "1m", label: "1B" },
  { value: "1y", label: "1T" },
  { value: "all", label: "Semua", flex: 1 },
];

export const InternalHomeDataSummary = (
  props: InternalHomeDataSummaryProps,
) => {
  // States
  const [period, setPeriod] = useState<HomePeriod>("all");

  return (
    <Container.Root flex={"1 1 550px"} withContext={true} {...props}>
      <Container.Body gap={4} py={SPACING.md}>
        <InternalHomeDataSummaryHeader
          period={period}
          onPeriodChange={setPeriod}
        />

        <InternalHomeDataSummaryCharts period={period} />
      </Container.Body>
    </Container.Root>
  );
};

const InternalHomeDataSummaryHeader = (
  props: InternalHomeDataSummaryHeaderProps,
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
      <VStack gap={1} align={"start"}>
        <P fontSize={"lg"} fontWeight={"semibold"}>
          {"Ringkasan Data"}
        </P>

        <P fontSize={"sm"} color={"fg.subtle"}>
          {"Ringkasan data layanan IGT yang Anda kelola."}
        </P>
      </VStack>

      <SegmentGroupInput
        value={period}
        onValueChange={(e) => onPeriodChange(e.value as HomePeriod)}
        options={PERIOD_OPTIONS}
      />
    </HStack>
  );
};

const FIELD_STATUSES: DataSummaryStatusConfig[] = [
  {
    key: "active",
    label: "Total Data Aktif",
    colorPalette: "blue",
    legendColor: "blue.solid",
    striped: true,
  },
  {
    key: "inactive",
    label: "Total Data Tidak Aktif",
    bg: "border.subtle",
    legendColor: "fg.subtle",
    striped: false,
  },
];

const AREA_STATUSES: DataSummaryStatusConfig[] = [
  {
    key: "active",
    label: "Total Data Aktif",
    colorPalette: "orange",
    legendColor: "orange.solid",
    striped: true,
  },
  {
    key: "inactive",
    label: "Total Data Tidak Aktif",
    bg: "border.subtle",
    legendColor: "fg.subtle",
    striped: false,
  },
];

const InternalHomeDataSummaryCharts = (
  props: InternalHomeDataSummaryChartsProps,
) => {
  // Props
  const { period } = props;

  // Queries / Data for current period
  const { dataSummary } = useInternalHomeData(period);

  return (
    <SimpleGrid columns={1} gap={SPACING.md} px={SPACING.md}>
      {/* IGT Berbasis Bidang */}
      <VStack align={"start"} gap={SPACING.md}>
        <P color={"fg.muted"}>{"IGT Berbasis Bidang"}</P>

        <HStack gap={SPACING.xs} w={"full"}>
          {FIELD_STATUSES.map((config) => {
            const value = dataSummary.field[config.key];

            return (
              <Progress.Root
                key={config.key}
                value={100}
                size={"xl"}
                flex={value}
                striped={config.striped}
                colorPalette={config.colorPalette}
              >
                <Progress.Track shadow={"none"}>
                  <Progress.Range bg={config.bg} />
                </Progress.Track>
              </Progress.Root>
            );
          })}
        </HStack>

        <HStack wrap={"wrap"} gap={6} w={"full"}>
          {FIELD_STATUSES.map((config) => {
            const value = dataSummary.field[config.key];
            return (
              <InternalHomeDataSummaryLegend
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
      <VStack align={"start"} gap={SPACING.md}>
        <P color={"fg.muted"}>{"IGT Berbasis Kawasan"}</P>

        <HStack gap={SPACING.xs} w={"full"}>
          {AREA_STATUSES.map((config) => {
            const value = dataSummary.area[config.key];
            return (
              <Progress.Root
                key={config.key}
                value={100}
                size={"xl"}
                flex={value}
                striped={config.striped}
                colorPalette={config.colorPalette}
              >
                <Progress.Track shadow={"none"}>
                  <Progress.Range bg={config.bg} />
                </Progress.Track>
              </Progress.Root>
            );
          })}
        </HStack>

        <HStack wrap={"wrap"} gap={6} w={"full"}>
          {AREA_STATUSES.map((config) => {
            const value = dataSummary.area[config.key];
            return (
              <InternalHomeDataSummaryLegend
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

const InternalHomeDataSummaryLegend = (
  props: InternalHomeDataSummaryLegendProps,
) => {
  // Props
  const { legendColor, label, value, ...restProps } = props;

  return (
    <VStack align={"start"} gap={1} {...restProps}>
      <HStack align={"center"} gap={2}>
        <Box w={"8px"} h={"8px"} rounded={"full"} bg={legendColor} />
        <P color={"fg.muted"} fontSize={"xs"}>
          {label}
        </P>
      </HStack>

      <P fontSize={"xl"} fontWeight={"bold"}>
        <FormatNumber value={value} />
        <Span fontSize={"xs"} color={"fg.subtle"} fontWeight={"normal"} ml={1}>
          {"Data"}
        </Span>
      </P>
    </VStack>
  );
};
