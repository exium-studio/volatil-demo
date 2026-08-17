// src/features/internal/home/pages/internal.home.page.tsx

import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { PADDING } from "@/design-system/constants/styles";
import { InternalHomeIgtDataList } from "@/features/internal/home/components/internal.home.data-list";
import { InternalHomeDataSummary } from "@/features/internal/home/components/internal.home.data-summary";
import { InternalHomeOrderSummary } from "@/features/internal/home/components/internal.home.order-summary";
import { InternalHomeServiceRate } from "@/features/internal/home/components/internal.home.service-rate";
import { useInternalHomeData } from "@/features/internal/home/hooks/use-internal-home.query";

export const InternalHomePage = () => {
  // Queries / Data
  const { isLoading, isFetching } = useInternalHomeData();

  if (isLoading) {
    return (
      <PanelContentContainer h={"auto"} gap={PADDING.sm} p={PADDING.sm}>
        <HStack wrap={"wrap"} gap={PADDING.sm} w={"full"}>
          <Skeleton h={"350px"} flex={"1 1 550px"} />
          <Skeleton h={"350px"} flex={"1 1 350px"} />
        </HStack>

        <Skeleton h={"200px"} w={"full"} />

        <Skeleton h={"380px"} w={"full"} />
      </PanelContentContainer>
    );
  }

  return (
    <PanelContentContainer
      h={"auto"}
      gap={PADDING.sm}
      p={PADDING.sm}
      position={"relative"}
    >
      <TopBarLoader isFetching={isFetching} />

      <HStack wrap={"wrap"} gap={PADDING.sm}>
        <InternalHomeDataSummary />
        <InternalHomeServiceRate />
      </HStack>

      <InternalHomeOrderSummary />

      <InternalHomeIgtDataList />
    </PanelContentContainer>
  );
};
