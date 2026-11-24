// src/features/internal/security-monitoring/components/security-overview.stats.tsx

import { StatGrid } from "@/design-system/components/data-display/ui/stat-grid";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { Circle } from "@/design-system/components/layout/ui/box";
import {
  Container,
  useContainerContext,
} from "@/design-system/components/layout/ui/container";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { useSecurityOverviewQuery } from "@/features/internal/security-monitoring/hooks/use-security-monitoring.query";
import {
  ActivityIcon,
  AlertTriangleIcon,
  FlameIcon,
  ShieldAlertIcon,
} from "lucide-react";

export const SecurityOverviewStatsCards = () => {
  return (
    <Container.Root withContext={true} w={"full"}>
      <SecurityOverviewStatsCardsContent />
    </Container.Root>
  );
};

const SecurityOverviewStatsCardsContent = () => {
  // Contexts
  const { isSmContainer } = useContainerContext();

  // Queries
  const { data, isLoading } = useSecurityOverviewQuery();

  if (isLoading) {
    return <Skeleton minH={isSmContainer ? "240px" : "180px"} w={"full"} />;
  }

  const stats = [
    {
      label: "Pengguna Berisiko Tinggi",
      value: data?.highRiskUserCount ?? 0,
      description: "Skor risiko >= 70 (Throttled/Suspended)",
      icon: ShieldAlertIcon,
      colorPalette: "red",
    },
    {
      label: "Pelanggaran Rate Limit (24 Jam)",
      value: data?.rateLimitedCount24h ?? 0,
      description: "Permintaan berkecepatan tinggi yang ditahan",
      icon: AlertTriangleIcon,
      colorPalette: "orange",
    },
    {
      label: "Insiden Ancaman Aktif",
      value: data?.openIncidentsCount ?? 0,
      description: "Kasus crawling sistematis dalam peninjauan",
      icon: FlameIcon,
      colorPalette: "purple",
    },
    {
      label: "Total Permintaan Peta (24 Jam)",
      value: data?.totalLogs24h ?? 0,
      description: "Lalu lintas WFS, WMS, dan query spasial",
      icon: ActivityIcon,
      colorPalette: "blue",
    },
  ];

  const cols = isSmContainer ? 1 : 4;

  return (
    <Container.Body>
      <HeaderContainer>
        <HStack align={"center"} gap={"xs"}>
          <Heading size={"md"}>{"Ringkasan Keamanan & Ancaman Peta"}</Heading>

          <InfoTip
            variant={"icon"}
            appIconProps={{
              size: "xs",
              color: "fg.subtle",
            }}
          >
            {
              "Statistik pengawasan anomali keamanan akses layanan peta dan rate limit 24 jam terakhir."
            }
          </InfoTip>
        </HStack>
      </HeaderContainer>

      <Separator borderColor={"bg.canvas"} />

      <StatGrid.Root columns={cols}>
        {stats.map((s, index) => {
          const IconComp = s.icon;
          const colorPalette = s.colorPalette;
          const formattedValue = new Intl.NumberFormat("id-ID").format(s.value);

          return (
            <StatGrid.Item key={s.label} index={index} columns={cols}>
              <StatGrid.Header>
                <HStack gap={"xs"} align={"center"}>
                  <Circle bg={`${colorPalette}.subtle`} p={"2xs"}>
                    <AppIcon
                      icon={IconComp}
                      size={"xs"}
                      color={`${colorPalette}.fg`}
                    />
                  </Circle>

                  <StatGrid.Label>{s.label}</StatGrid.Label>
                </HStack>
              </StatGrid.Header>

              <StatGrid.Value value={formattedValue} />

              <StatGrid.Description>{s.description}</StatGrid.Description>
            </StatGrid.Item>
          );
        })}
      </StatGrid.Root>
    </Container.Body>
  );
};
