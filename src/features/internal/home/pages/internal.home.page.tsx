// src/features/internal/home/pages/internal.home.page.tsx

import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { InternalHomeLeaderboard } from "@/features/internal/home/components/internal.home.leaderboard";
import { InternalHomeMitraRegistration } from "@/features/internal/home/components/internal.home.mitra-registration";
import { InternalHomePublishStatusSummary } from "@/features/internal/home/components/internal.home.publish-status-summary";
import { InternalHomeServiceRate } from "@/features/internal/home/components/internal.home.service-rate";
import { InternalHomeSpatialBasisSummary } from "@/features/internal/home/components/internal.home.spatial-basis-summary";
import { InternalHomeTrend } from "@/features/internal/home/components/internal.home.trend";
import { useInternalHomeData } from "@/features/internal/home/hooks/use-internal-home.query";

export const InternalHomePage = () => {
  // Queries / Data
  const { isLoading, isFetching } = useInternalHomeData();

  if (isLoading) {
    return (
      <PanelContentContainer h={"auto"}>
        <HStack wrap={"wrap"} gap={"sm"} w={"full"}>
          <Skeleton h={"260px"} flex={"1 1 240px"} />
          <Skeleton h={"260px"} flex={"1 1 240px"} />
          <Skeleton h={"260px"} flex={"1 1 280px"} />
          <Skeleton h={"260px"} flex={"1 1 320px"} />
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

      {/* Row 1: 3 Dedicated Summary Cards + Tarif Jasa Akses */}
      <HStack wrap={"wrap"} gap={"sm"} align={"stretch"} w={"full"}>
        <InternalHomeSpatialBasisSummary />
        <InternalHomePublishStatusSummary />
        <InternalHomeMitraRegistration />
        <InternalHomeServiceRate />
      </HStack>

      {/* Row 2: Grafik Tren Akuisisi Data IGT */}
      <InternalHomeTrend />

      {/* Row 3: Leaderboard Mitra Teraktif & Layer Paling Diminati */}
      <InternalHomeLeaderboard />
    </PanelContentContainer>
  );
};
