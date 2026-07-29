// src/features/home/components/DataSummary.tsx

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
import { P } from "@/design-system/components/typography/ui/p";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import {
  PADDING_MD,
  PADDING_SM,
  SPACING_MD,
  SPACING_SM,
} from "@/design-system/constants/styles";
import type {
  LegendProps,
  HomeSummaryStatus,
} from "@/features/home/types/home.data-summary.type";
import { homeDataSummary } from "@/shared/constants/dummy-data";

const ProgressBar = (props: ProgressRootProps) => {
  return (
    <Progress.Root value={100} size={"xl"} flex={1} {...props}>
      <Progress.Track shadow={"none"}>
        <Progress.Range bg={props.bg} />
      </Progress.Track>
    </Progress.Root>
  );
};

const Legend = (props: LegendProps) => {
  // Props
  const { legendColor, label, value, ...restProps } = props;

  return (
    <HStack align={"start"} gap={2} {...restProps}>
      <Box w={"8px"} h={"8px"} bg={legendColor} mt={2} />

      <Box>
        <P fontSize={"sm"} color={"fg.muted"}>
          {label}
        </P>

        <P fontSize={"lg"} fontWeight={"semibold"}>
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
  const statuses: HomeSummaryStatus[] = ["active", "almostExpired", "expired"];

  // Utils
  const getSummaryItemProps = (
    type: "field" | "area",
    status: HomeSummaryStatus,
  ) => {
    switch (status) {
      case "active": {
        const palette = type === "field" ? "blue" : "orange";
        return {
          label: "Aktif",
          colorPalette: palette,
          bg: undefined,
          legendColor: `${palette}.solid`,
          striped: true,
        };
      }
      case "almostExpired":
        return {
          label: "Hampir kadaluwarsa",
          colorPalette: undefined,
          bg: "an4",
          legendColor: "an4",
          striped: false,
        };
      default:
        return {
          label: "Kadaluwarsa",
          colorPalette: undefined,
          bg: "an2",
          legendColor: "an2",
          striped: false,
        };
    }
  };

  return (
    <SimpleGrid columns={isSmContainer ? 1 : 2} gap={PADDING_MD} p={PADDING_MD}>
      {/* IGT Berbasis Bidang */}
      <VStack align={"start"} gap={SPACING_MD}>
        <P color={"fg.muted"}>IGT berbasis bidang</P>

        <HStack gap={SPACING_SM} w={"full"}>
          {statuses.map((key) => {
            const config = getSummaryItemProps("field", key);
            const value = homeDataSummary.field[key];

            return (
              <ProgressBar
                key={key}
                striped={config.striped}
                colorPalette={config.colorPalette}
                bg={config.bg}
                flex={value}
              />
            );
          })}
        </HStack>

        <HStack wrap={"wrap"} gap={4}>
          {statuses.map((key) => {
            const config = getSummaryItemProps("field", key);
            const value = homeDataSummary.field[key];
            return (
              <Legend
                key={key}
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
          {statuses.map((key) => {
            const config = getSummaryItemProps("area", key);
            const value = homeDataSummary.area[key];
            return (
              <ProgressBar
                key={key}
                striped={config.striped}
                colorPalette={config.colorPalette}
                bg={config.bg}
                flex={value}
              />
            );
          })}
        </HStack>

        <HStack wrap={"wrap"} gap={4}>
          {statuses.map((key) => {
            const config = getSummaryItemProps("area", key);
            const value = homeDataSummary.area[key];
            return (
              <Legend
                key={key}
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

export const DataSummary = () => {
  return (
    <Container.Root px={PADDING_SM} withContext={true}>
      <Container.Body>
        <HStack align={"center"} justify={"space-between"} p={PADDING_MD}>
          <VStack gap={1}>
            <P>Ringkasan data Anda</P>
            <P fontSize={"sm"} color={"fg.subtle"}>
              Ringkasan data Anda
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

        <Charts />
      </Container.Body>
    </Container.Root>
  );
};
