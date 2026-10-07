import { Button } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { AppContentContainer } from "@/design-system/components/layout/ui/page-container";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { toast } from "@/design-system/components/toast";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { InternalHomeIgtBasisSummary } from "@/features/internal/home/components/internal.home.igt-basis-summary";
import { InternalHomeLeaderboard } from "@/features/internal/home/components/internal.home.leaderboard";
import { InternalHomeMitraLayerSyncJobsQuickView } from "@/features/internal/home/components/internal.home.mitra-layer-sync-jobs-quick-view";
import { InternalHomeMitraRegistration } from "@/features/internal/home/components/internal.home.mitra-registration";
import { InternalHomePublishStatusSummary } from "@/features/internal/home/components/internal.home.publish-status-summary";
import { InternalHomeServiceRate } from "@/features/internal/home/components/internal.home.service-rate";
import { InternalHomeTrend } from "@/features/internal/home/components/internal.home.trend";
import { InternalHomeUserGuideManagement } from "@/features/internal/home/components/internal.home.user-guide-management";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { useQueryClient } from "@tanstack/react-query";
import { RefreshCwIcon } from "lucide-react";
import { useState } from "react";

export const InternalHomePage = () => {
  // Hooks
  const queryClient = useQueryClient();

  // States
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handlers
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.internal.home.all }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.internal.mitraLayerSyncJobs.all,
        }),
        queryClient.invalidateQueries({ queryKey: queryKeys.userGuide.all }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.internal.pricing.all,
        }),
      ]);
      toast.success("Data dashboard berhasil diperbarui", {
        group: "Dashboard",
      });
    } catch {
      toast.error("Gagal memperbarui data dashboard", {
        group: "Dashboard",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <AppContentContainer h={"auto"} position={"relative"}>
      {/* Dashboard Top Header */}
      <HeaderContainer
        justify={"space-between"}
        align={"center"}
        w={"full"}
        px={0}
      >
        <HStack gap={"xs"} align={"center"}>
          <Heading>{"Dashboard Internal"}</Heading>

          <InfoTip
            variant={"icon"}
            appIconProps={{
              size: "xs",
              color: "fg.subtle",
            }}
          >
            {
              "Ringkasan analitik data spasial IGT, status registrasi mitra, antrean sinkronisasi, dan statistik akuisisi."
            }
          </InfoTip>
        </HStack>

        <Button
          variant={"ghost"}
          size={"sm"}
          onClick={handleRefresh}
          loading={isRefreshing}
          disabled={isRefreshing}
        >
          <AppIcon icon={RefreshCwIcon} />
          {"Segarkan Data"}
        </Button>
      </HeaderContainer>

      {/* Row 1: 3 Dedicated Summary Cards + Tarif Jasa Akses */}
      <HStack wrap={"wrap"} gap={"sm"} align={"stretch"} w={"full"}>
        <InternalHomeIgtBasisSummary />
        <InternalHomePublishStatusSummary />
        <InternalHomeMitraRegistration />
        <InternalHomeServiceRate />
      </HStack>

      {/* Row 2: Grafik Tren Akuisisi Data IGT */}
      <InternalHomeTrend />

      {/* Row 3: Leaderboard Mitra Teraktif & Layer Paling Diminati */}
      <InternalHomeLeaderboard />

      {/* Row 4: Quick View Antrean Job Pembaruan Layer Mitra (Max 10) */}
      <InternalHomeMitraLayerSyncJobsQuickView />

      {/* Row 5: Manajemen Dokumen Panduan Pengguna */}
      <InternalHomeUserGuideManagement />
    </AppContentContainer>
  );
};
