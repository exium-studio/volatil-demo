// src/features/internal/home/pages/internal.home.page.tsx

import { Progress } from "@/design-system/components/feedback/ui/progress";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { PADDING_SM } from "@/design-system/constants/styles";
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
      <PanelContentContainer h={"auto"} gap={PADDING_SM} p={PADDING_SM}>
        <HStack wrap={"wrap"} gap={PADDING_SM} w={"full"}>
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
      gap={PADDING_SM}
      p={PADDING_SM}
      position={"relative"}
    >
      <Progress.Root
        value={null}
        size={"xs"}
        w={"full"}
        position={"absolute"}
        top={0}
        left={0}
        right={0}
        zIndex={10}
        opacity={isFetching ? 1 : 0}
        pointerEvents={"none"}
        transition={"opacity 200ms ease"}
      >
        <Progress.Track>
          <Progress.Range />
        </Progress.Track>
      </Progress.Root>

      <HStack wrap={"wrap"} gap={PADDING_SM}>
        <InternalHomeDataSummary />
        <InternalHomeServiceRate />
      </HStack>

      <InternalHomeOrderSummary />

      <InternalHomeIgtDataList />
    </PanelContentContainer>
  );
};
