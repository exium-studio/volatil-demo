// src/features/internal/home/pages/internal.home.page.tsx

import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { InternalHomeDataSummary } from "@/features/internal/home/components/internal.home.data-summary";
import { InternalHomeLeaderboard } from "@/features/internal/home/components/internal.home.leaderboard";
import { InternalHomeServiceRate } from "@/features/internal/home/components/internal.home.service-rate";
import { InternalHomeTrend } from "@/features/internal/home/components/internal.home.trend";
import { useInternalHomeData } from "@/features/internal/home/hooks/use-internal-home.query";

export const InternalHomePage = () => {
  // Queries / Data
  const { isLoading, isFetching } = useInternalHomeData();

  if (isLoading) {
    return (
      <PanelContentContainer h={"auto"}>
        <HStack wrap={"wrap"} gap={"sm"} w={"full"}>
          <Skeleton h={"350px"} flex={"1 1 550px"} />
          <Skeleton h={"350px"} flex={"1 1 350px"} />
        </HStack>

        <Skeleton h={"320px"} w={"full"} />

        <HStack wrap={"wrap"} gap={"sm"} w={"full"}>
          <Skeleton h={"280px"} flex={"1 1 450px"} />
          <Skeleton h={"280px"} flex={"1 1 450px"} />
        </HStack>
      </PanelContentContainer>
    );
  }

  return (
    <PanelContentContainer h={"auto"} position={"relative"}>
      <TopBarLoader isFetching={isFetching} />

      {/* Row 1: Ringkasan Data Aktif/Nonaktif & Tarif PNBP */}
      <HStack wrap={"wrap"} gap={"sm"}>
        <InternalHomeDataSummary />
        <InternalHomeServiceRate />
      </HStack>

      {/* Row 2: Grafik Tren Akuisisi Data IGT & PNBP */}
      <InternalHomeTrend />

      <InternalHomeLeaderboard />
    </PanelContentContainer>
  );
};
