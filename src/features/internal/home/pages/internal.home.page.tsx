// src/features/internal/home/pages/internal.home.page.tsx

import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { InternalHomeLeaderboard } from "@/features/internal/home/components/internal.home.leaderboard";
import { InternalHomeMitraRegistration } from "@/features/internal/home/components/internal.home.mitra-registration";
import { InternalHomePublishStatusSummary } from "@/features/internal/home/components/internal.home.publish-status-summary";
import { InternalHomeServiceRate } from "@/features/internal/home/components/internal.home.service-rate";
import { InternalHomeSpatialBasisSummary } from "@/features/internal/home/components/internal.home.spatial-basis-summary";
import { InternalHomeTrend } from "@/features/internal/home/components/internal.home.trend";

export const InternalHomePage = () => {
  return (
    <PanelContentContainer h={"auto"} position={"relative"}>
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
