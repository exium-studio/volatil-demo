// src/features/internal/security-monitoring/pages/internal.security-monitoring.page.tsx

import { Tabs } from "@/design-system/components/disclosure/ui/tabs";
import { AppContentContainer } from "@/design-system/components/layout/ui/page-container";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { SecurityActivityLogsTable } from "@/features/internal/security-monitoring/components/security-activity-logs.table";
import { SecurityOverviewStatsCards } from "@/features/internal/security-monitoring/components/security-overview.stats";
import { SecurityUsersTable } from "@/features/internal/security-monitoring/components/security-users.table";

export const InternalSecurityMonitoringPage = () => {
  return (
    <AppContentContainer h={"auto"}>
      <VStack gap={"md"} w={"full"} align={"stretch"}>
        {/* Metrik Ringkasan Keamanan */}
        <SecurityOverviewStatsCards />

        {/* Tab Peringkat Risiko User & Log Aktivitas Layanan Peta */}
        <Tabs.Root defaultValue={"users"} variant={"line"} w={"full"}>
          <Tabs.List>
            <Tabs.Trigger value={"users"}>
              {"Peringkat Risiko Pengguna"}
            </Tabs.Trigger>
            <Tabs.Trigger value={"logs"}>
              {"Log Aktivitas Layanan Peta"}
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value={"users"}>
            <SecurityUsersTable />
          </Tabs.Content>

          <Tabs.Content value={"logs"}>
            <SecurityActivityLogsTable />
          </Tabs.Content>
        </Tabs.Root>
      </VStack>
    </AppContentContainer>
  );
};
