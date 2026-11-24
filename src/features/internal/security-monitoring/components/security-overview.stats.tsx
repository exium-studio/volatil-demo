// src/features/internal/security-monitoring/components/security-overview.stats.tsx

import { StatGrid } from "@/design-system/components/data-display/ui/stat-grid";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Circle } from "@/design-system/components/layout/ui/box";
import { Container, useContainerContext } from "@/design-system/components/layout/ui/container";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { P } from "@/design-system/components/typography/ui/p";
import { useSecurityOverviewQuery } from "@/features/internal/security-monitoring/hooks/use-security-monitoring.query";
import { ActivityIcon, AlertTriangleIcon, FlameIcon, ShieldAlertIcon } from "lucide-react";

export const SecurityOverviewStatsCards = () => {
  const { isSmContainer } = useContainerContext();
  const { data, isLoading } = useSecurityOverviewQuery();

  if (isLoading) {
    return <Skeleton minH={"110px"} w={"full"} />;
  }

  const stats = [
    {
      label: "Pengguna Berisiko Tinggi",
      value: data?.highRiskUserCount ?? 0,
      description: "Skor risiko >= 70 (Throttled/Suspended)",
      icon: ShieldAlertIcon,
      color: "red",
    },
    {
      label: "Pelanggaran Rate Limit (24 Jam)",
      value: data?.rateLimitedCount24h ?? 0,
      description: "Permintaan berkecepatan tinggi yang ditahan",
      icon: AlertTriangleIcon,
      color: "orange",
    },
    {
      label: "Insiden Ancaman Aktif",
      value: data?.openIncidentsCount ?? 0,
      description: "Kasus crawling sistematis dalam peninjauan",
      icon: FlameIcon,
      color: "purple",
    },
    {
      label: "Total Permintaan Peta (24 Jam)",
      value: data?.totalLogs24h ?? 0,
      description: "Lalu lintas WFS, WMS, dan query spasial",
      icon: ActivityIcon,
      color: "blue",
    },
  ];

  const cols = isSmContainer ? 1 : 4;

  return (
    <StatGrid.Root columns={cols} w={"full"}>
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <Container.Root key={s.label} flex={"1 1 200px"} withContext={true}>
            <Container.Body p={"md"} gap={"xs"}>
              <HStack justify={"space-between"} align={"center"}>
                <P fontSize={"xs"} fontWeight={"medium"} color={"fg.muted"}>
                  {s.label}
                </P>
                <Circle size={"28px"} bg={`${s.color}.subtle`} color={`${s.color}.fg`}>
                  <AppIcon icon={Icon} size={"xs"} />
                </Circle>
              </HStack>

              <Heading size={"2xl"} color={`${s.color}.fg`}>
                {new Intl.NumberFormat("id-ID").format(s.value)}
              </Heading>

              <P fontSize={"2xs"} color={"fg.subtle"}>
                {s.description}
              </P>
            </Container.Body>
          </Container.Root>
        );
      })}
    </StatGrid.Root>
  );
};
