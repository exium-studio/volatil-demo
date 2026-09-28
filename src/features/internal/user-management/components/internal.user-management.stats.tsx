// src/features/internal/user-management/components/internal.user-management.stats.tsx

import { Progress } from "@/design-system/components/feedback/ui/progress";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { Box } from "@/design-system/components/layout/ui/box";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { SimpleGrid } from "@/design-system/components/layout/ui/grid";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { P } from "@/design-system/components/typography/ui/p";
import { Span } from "@/design-system/components/typography/ui/span";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { useUserManagementStatsQuery } from "@/features/internal/user-management/hooks/use-user-management.query";
import type {
  UserManagementStatsChartsProps,
  UserManagementStatsLegendProps,
  UserManagementStatsRoleConfig,
  UserManagementStatsStatusConfig,
} from "@/features/internal/user-management/types/user-management.type";

export const InternalUserManagementStats = () => {
  // Queries
  const { stats, isLoading, isFetching } = useUserManagementStatsQuery();

  if (isLoading) {
    return <Skeleton h={"182px"} w={"full"} p={"md"} />;
  }

  return (
    <Container.Root withContext={true} position={"relative"}>
      <TopBarLoader isFetching={isFetching} />

      <Container.Body gap={4} py={"md"}>
        <UserManagementStatsHeader />
        <UserManagementStatsCharts stats={stats} />
      </Container.Body>
    </Container.Root>
  );
};

const UserManagementStatsHeader = () => {
  return (
    <HStack
      wrap={"wrap"}
      align={"center"}
      justify={"space-between"}
      gap={"md"}
      px={"md"}
    >
      <HStack gap={"xs"} align={"center"}>
        <Heading>{"Statistik Pengguna"}</Heading>

        <InfoTip
          variant={"icon"}
          appIconProps={{
            size: "xs",
            color: "fg.subtle",
          }}
        >
          {"Ringkasan status dan tipe peran pengguna sistem."}
        </InfoTip>
      </HStack>
    </HStack>
  );
};

const STATUS_CONFIG: UserManagementStatsStatusConfig[] = [
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

const ROLE_CONFIG: UserManagementStatsRoleConfig[] = [
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
  const { stats } = props;

  return (
    <SimpleGrid columns={[1, 1, 2]} gap={"md"} px={"md"}>
      {/* Kategori Status Aktif */}
      <VStack align={"start"} gap={"md"}>
        <P color={"fg.muted"}>{"Kategori Status Pengguna"}</P>

        <HStack gap={"xs"} w={"full"}>
          {STATUS_CONFIG.map((config) => {
            const value = stats.statusStats[config.key];

            return (
              <Progress.Root
                key={config.key}
                value={100}
                size={"xl"}
                flex={value || 0.001}
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
          {STATUS_CONFIG.map((config) => {
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
      <VStack align={"start"} gap={"md"}>
        <P color={"fg.muted"}>{"Kategori Tipe Pengguna (Role)"}</P>

        <HStack gap={"xs"} w={"full"}>
          {ROLE_CONFIG.map((config) => {
            const value = stats.roleStats[config.key];

            return (
              <Progress.Root
                key={config.key}
                value={100}
                size={"xl"}
                flex={value || 0.001}
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
          {ROLE_CONFIG.map((config) => {
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
