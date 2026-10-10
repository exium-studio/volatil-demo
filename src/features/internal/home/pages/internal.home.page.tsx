import { Button } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { AppContentContainer } from "@/design-system/components/layout/ui/page-container";
import { toast } from "@/design-system/components/toast";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { InternalHomeIgtBasisSummary } from "@/features/internal/home/components/internal.home.igt-basis-summary";
import { InternalHomeLeaderboard } from "@/features/internal/home/components/internal.home.leaderboard";
import { InternalHomeMitraLayerSyncJobsQuickView } from "@/features/internal/home/components/internal.home.mitra-layer-sync-jobs-quick-view";
import { InternalHomeMitraRegistration } from "@/features/internal/home/components/internal.home.mitra-registration";
import { InternalHomePolicies } from "@/features/internal/home/components/internal.home.policies";
import { InternalHomePricing } from "@/features/internal/home/components/internal.home.pricing";
import { InternalHomePublishStatusSummary } from "@/features/internal/home/components/internal.home.publish-status-summary";
import { InternalHomeTrend } from "@/features/internal/home/components/internal.home.trend";
import { InternalHomeUserGuideManagement } from "@/features/internal/home/components/internal.home.user-guide-management";
import { useAuthSession } from "@/features/auth/hooks/use-auth-session";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { useQueryClient } from "@tanstack/react-query";
import { RefreshCwIcon } from "lucide-react";
import { useState } from "react";

export const InternalHomePage = () => {
  // Hooks
  const queryClient = useQueryClient();
  const { user } = useAuthSession();

  // Derived Values
  const displayName = user?.name || "Admin";
  const currentHour = new Date().getHours();
  const timeGreeting =
    currentHour >= 4 && currentHour < 11
      ? "Selamat Pagi"
      : currentHour >= 11 && currentHour < 15
        ? "Selamat Siang"
        : currentHour >= 15 && currentHour < 18
          ? "Selamat Sore"
          : "Selamat Malam";

  const greetingText = `Halo, ${displayName}! ${timeGreeting}`;

  // States
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handlers
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.internal.home.all,
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.internal.mitraLayerSyncJobs.all,
        }),
        queryClient.invalidateQueries({ queryKey: queryKeys.userGuide.all }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.internal.pricing.all,
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.internal.systemPolicies.all,
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
    <AppContentContainer position={"relative"} h={"auto"}>
      {/* Dashboard Top Header */}
      <HStack justify={"space-between"} align={"center"} w={"full"} mb={"xs"}>
        <HStack align={"center"} pl={"md"}>
          <Heading>{greetingText}</Heading>
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
      </HStack>

      {/* Row 1: 3 Dedicated Summary Cards */}
      <HStack wrap={"wrap"} gap={"sm"} align={"stretch"} w={"full"}>
        <InternalHomeIgtBasisSummary />
        <InternalHomePublishStatusSummary />
        <InternalHomeMitraRegistration />
      </HStack>

      {/* Row 2: Master Tarif & Limit PNBP (Pricing) */}
      <InternalHomePricing w={"full"} />

      {/* Row 3: Kebijakan Siklus & Perpanjangan Pesanan (Policy) */}
      <InternalHomePolicies w={"full"} />

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
