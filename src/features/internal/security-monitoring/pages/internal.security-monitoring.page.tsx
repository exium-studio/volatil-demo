// src/features/internal/security-monitoring/pages/internal.security-monitoring.page.tsx

import { Tabs } from "@/design-system/components/disclosure/ui/tabs";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Container } from "@/design-system/components/layout/ui/container";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { AppContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { useIsSmallViewport } from "@/design-system/hooks/use-is-small-viewport";
import { SecurityActivityLogsTable } from "@/features/internal/security-monitoring/components/security-activity-logs.table";
import { SecurityOverviewStatsCards } from "@/features/internal/security-monitoring/components/security-overview.stats";
import { SecurityUsersTable } from "@/features/internal/security-monitoring/components/security-users.table";
import { HistoryIcon, ShieldAlertIcon } from "lucide-react";
import { useState } from "react";

export const InternalSecurityMonitoringPage = () => {
  // Contexts
  const isSmallViewport = useIsSmallViewport();

  // States
  const [activeTab, setActiveTab] = useState<string>("users");

  return (
    <AppContentContainer h={"auto"}>
      <VStack gap={"md"} w={"full"} align={"stretch"}>
        {/* Metrik Ringkasan Keamanan */}
        <SecurityOverviewStatsCards />

        {/* Tab Peringkat Risiko User & Log Aktivitas Layanan Peta dalam Container rapi */}
        <Container.Root flex={1} withContext={true} position={"relative"}>
          <Container.Body overflow={"clip"}>
            <Tabs.Root
              value={activeTab}
              w={"full"}
              display={"flex"}
              flexDir={"column"}
              onValueChange={(details) => {
                setActiveTab(details.value);
              }}
            >
              <Tabs.List
                borderColor={"bg.canvas"}
                pos={isSmallViewport ? "sticky" : undefined}
                top={isSmallViewport ? 0 : undefined}
                zIndex={isSmallViewport ? 10 : undefined}
                bg={isSmallViewport ? "bg.body" : undefined}
              >
                <Tabs.Trigger
                  value={"users"}
                  flex={1}
                  justifyContent={"center"}
                  h={"headerH"}
                >
                  <AppIcon icon={ShieldAlertIcon} />
                  {"Peringkat Risiko Pengguna"}
                </Tabs.Trigger>

                <Tabs.Trigger
                  value={"logs"}
                  flex={1}
                  justifyContent={"center"}
                  h={"headerH"}
                >
                  <AppIcon icon={HistoryIcon} />
                  {"Log Aktivitas Layanan Peta"}
                </Tabs.Trigger>
              </Tabs.List>

              <Separator borderColor={"bg.canvas"} />

              <Tabs.Content value={"users"} p={0} m={0}>
                <SecurityUsersTable />
              </Tabs.Content>

              <Tabs.Content value={"logs"} p={0} m={0}>
                <SecurityActivityLogsTable />
              </Tabs.Content>
            </Tabs.Root>
          </Container.Body>
        </Container.Root>
      </VStack>
    </AppContentContainer>
  );
};
