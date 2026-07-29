// src/features/home/components/home.data-summary.tsx

import type { ProgressRootProps } from "@/design-system/components/feedback/types/progress.type";
import { Progress } from "@/design-system/components/feedback/ui/progress";
import { SegmentGroupInput } from "@/design-system/components/input/ui/segment-group-input";
import { Box } from "@/design-system/components/layout/ui/box";
import {
  Container,
  useContainerContext,
} from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { SimpleGrid } from "@/design-system/components/layout/ui/grid";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { P } from "@/design-system/components/typography/ui/p";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import {
  PADDING_MD,
  PADDING_SM,
  SPACING_MD,
  SPACING_SM,
} from "@/design-system/constants/styles";
import type {
  HomeDataSummaryLegendProps,
  HomeDataSummaryStatusConfig,
} from "@/features/home/types/home.data-summary.type";
import { homeData } from "@/shared/constants/dummy-data";

const ProgressBar = (props: ProgressRootProps) => {
  return (
    <Progress.Root value={100} size={"xl"} flex={1} {...props}>
      <Progress.Track shadow={"none"}>
        <Progress.Range bg={props.bg} />
      </Progress.Track>
    </Progress.Root>
  );
};

const Legend = (props: HomeDataSummaryLegendProps) => {
  // Props
  const { legendColor, label, value, ...restProps } = props;

  return (
    <HStack align={"start"} gap={2} {...restProps}>
      <Box w={"8px"} h={"8px"} bg={legendColor} mt={2} />

      <Box>
        <P color={"fg.muted"}>{label}</P>

        <P fontSize={"2xl"} fontWeight={"medium"}>
          <FormatNumber value={value} />
        </P>
      </Box>
    </HStack>
  );
};

const Charts = () => {
  // Contexts
  const { isSmContainer } = useContainerContext();

  // Constants
  const FIELD_STATUSES: HomeDataSummaryStatusConfig[] = [
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
  const AREA_STATUSES: HomeDataSummaryStatusConfig[] = [
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

  return (
    <SimpleGrid
      columns={isSmContainer ? 1 : 2}
      gap={PADDING_MD}
      px={PADDING_MD}
    >
      {/* IGT Berbasis Bidang */}
      <VStack align={"start"} gap={SPACING_MD}>
        <P color={"fg.muted"}>IGT berbasis bidang</P>

        <HStack gap={SPACING_SM} w={"full"}>
          {FIELD_STATUSES.map((config) => {
            const value = homeData.dataSummary.field[config.key];

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
            const value = homeData.dataSummary.field[config.key];
            return (
              <Legend
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
      <VStack align={"start"} gap={SPACING_MD}>
        <P color={"fg.muted"}>IGT berbasis kawasan</P>

        <HStack gap={SPACING_SM} w={"full"}>
          {AREA_STATUSES.map((config) => {
            const value = homeData.dataSummary.area[config.key];
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
            const value = homeData.dataSummary.area[config.key];
            return (
              <Legend
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

const Header = () => {
  return (
    <HStack align={"center"} justify={"space-between"} px={PADDING_MD}>
      <VStack gap={1}>
        <P>Ringkasan data Anda</P>
        <P fontSize={"sm"} color={"fg.subtle"}>
          Ringkasan informasi status data IGT Anda.
        </P>
      </VStack>

      <SegmentGroupInput
        defaultValue={"all"}
        options={[
          { value: "1h", label: "1H" },
          { value: "1w", label: "1M" },
          { value: "1b", label: "1B" },
          { value: "1t", label: "1T" },
          { value: "all", label: "Semua", flex: 1 },
        ]}
      />
    </HStack>
  );
};

export const DataSummary = () => {
  return (
    <Container.Root px={PADDING_SM} withContext={true}>
      <Container.Body gap={4} py={PADDING_MD}>
        <Header />

        <Separator borderWidth={"1px"} borderColor={"bg.canvas"} />

        <Charts />
      </Container.Body>
    </Container.Root>
  );
};
