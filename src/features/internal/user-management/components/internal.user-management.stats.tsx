// src/features/internal/user-management/components/internal.user-management.stats.tsx

import { Progress } from "@/design-system/components/feedback/ui/progress";
import { SegmentGroupInput } from "@/design-system/components/input/ui/segment-group-input";
import { Box } from "@/design-system/components/layout/ui/box";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { SimpleGrid } from "@/design-system/components/layout/ui/grid";
import { P } from "@/design-system/components/typography/ui/p";
import { Span } from "@/design-system/components/typography/ui/span";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { PADDING, SPACING } from "@/design-system/constants/styles";
import type {
  UserManagementStatsChartsProps,
  UserManagementStatsHeaderProps,
  UserManagementStatsLegendProps,
  UserManagementStatsRoleConfig,
  UserManagementStatsStatusConfig,
} from "@/features/internal/user-management/types/user-management.type";
import { useUserManagementQuery } from "@/features/internal/user-management/hooks/use-user-management.query";
import type { MitraHomePeriod } from "@/features/mitra/home/types/mitra.home.data-summary.type";
import { useState } from "react";

const PERIOD_OPTIONS = [
  { value: "1d", label: "1H" },
  { value: "1w", label: "1M" },
  { value: "1m", label: "1B" },
  { value: "1y", label: "1T" },
  { value: "all", label: "Semua", flex: 1 },
];

export const InternalUserManagementStats = () => {
  // States
  const [period, setPeriod] = useState<MitraHomePeriod>("all");

  return (
    <Container.Root flex={"1 1 100%"} withContext={true}>
      <Container.Body gap={4} py={PADDING.md}>
        <UserManagementStatsHeader period={period} onPeriodChange={setPeriod} />

        <UserManagementStatsCharts period={period} />
      </Container.Body>
    </Container.Root>
  );
};

const UserManagementStatsHeader = (props: UserManagementStatsHeaderProps) => {
  // Props
  const { period, onPeriodChange } = props;

  return (
    <HStack
      wrap={"wrap"}
      align={"center"}
      justify={"space-between"}
      gap={SPACING.md}
      px={PADDING.md}
    >
      <VStack gap={1} align={"start"}>
        <P fontSize={"lg"} fontWeight={"semibold"}>
          {"Statistik Pengguna"}
        </P>

        <P fontSize={"sm"} color={"fg.subtle"}>
          {"Ringkasan status dan tipe peran pengguna sistem."}
        </P>
      </VStack>

      <SegmentGroupInput
        value={period}
        onValueChange={(e) => onPeriodChange(e.value as MitraHomePeriod)}
        options={PERIOD_OPTIONS}
      />
    </HStack>
  );
};

const STATUS_CONFIGS: UserManagementStatsStatusConfig[] = [
  {
    key: "active",
    label: "Pengguna Aktif",
    colorPalette: "green",
    legendColor: "green.solid",
    striped: true,
  },
  {
    key: "inactive",
    label: "Pengguna Tidak Aktif",
    bg: "border.subtle",
    legendColor: "fg.subtle",
    striped: false,
  },
];

const ROLE_CONFIGS: UserManagementStatsRoleConfig[] = [
  {
    key: "internal",
    label: "Pengguna Internal",
    colorPalette: "purple",
    legendColor: "purple.solid",
    striped: true,
  },
  {
    key: "mitra",
    label: "Pengguna Mitra",
    colorPalette: "blue",
    legendColor: "blue.solid",
    striped: true,
  },
];

const UserManagementStatsCharts = (props: UserManagementStatsChartsProps) => {
  // Props
  const { period } = props;

  // Queries
  const { stats } = useUserManagementQuery({ period });

  return (
    <SimpleGrid columns={[1, 1, 2]} gap={PADDING.md} px={PADDING.md}>
      {/* Kategori Status Aktif */}
      <VStack align={"start"} gap={SPACING.md}>
        <P color={"fg.muted"}>{"Kategori Status Pengguna"}</P>

        <HStack gap={SPACING.xs} w={"full"}>
          {STATUS_CONFIGS.map((config) => {
            const value = stats.statusStats[config.key];

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
          {STATUS_CONFIGS.map((config) => {
            const value = stats.statusStats[config.key];
            return (
              <UserManagementStatsLegend
                key={config.key}
                legendColor={config.legendColor}
                label={config.label}
                value={value}
              />
            );
          })}
        </HStack>
      </VStack>

      {/* Kategori Role / Pengguna */}
      <VStack align={"start"} gap={SPACING.md}>
        <P color={"fg.muted"}>{"Kategori Tipe Pengguna (Role)"}</P>

        <HStack gap={SPACING.xs} w={"full"}>
          {ROLE_CONFIGS.map((config) => {
            const value = stats.roleStats[config.key];

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
          {ROLE_CONFIGS.map((config) => {
            const value = stats.roleStats[config.key];
            return (
              <UserManagementStatsLegend
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

const UserManagementStatsLegend = (props: UserManagementStatsLegendProps) => {
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
          {"Pengguna"}
        </Span>
      </P>
    </VStack>
  );
};
