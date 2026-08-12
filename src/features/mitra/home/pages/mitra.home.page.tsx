// src/features/mitra/home/pages/mitra.home.page.tsx

import { Progress } from "@/design-system/components/feedback/ui/progress";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { PADDING } from "@/design-system/constants/styles";
import { MitraHomeCartSummary } from "@/features/mitra/home/components/mitra.home.cart-summary";
import { MitraHomeDataSummary } from "@/features/mitra/home/components/mitra.home.data-summary";
import { MitraHomeFinancialFlow } from "@/features/mitra/home/components/mitra.home.financial-flow";
import { MitraHomeLastTransaction } from "@/features/mitra/home/components/mitra.home.last-transaction";
import { useMitraHomeData } from "@/features/mitra/home/hooks/use-mitra-home.query";

export const MitraHomePage = () => {
  // Queries / Data
  const { isLoading, isFetching } = useMitraHomeData();

  if (isLoading) {
    return (
      <PanelContentContainer h={"auto"} gap={PADDING.sm} p={PADDING.sm}>
        <Skeleton h={"233px"} w={"full"} />

        <HStack wrap={"wrap"} gap={PADDING.sm} w={"full"}>
          <Skeleton h={"353px"} flex={"1 1 300px"} />
          <Skeleton h={"353px"} flex={"1 1 500px"} />
          <Skeleton h={"353px"} flex={"1 1 100%"} />
        </HStack>
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

      <MitraHomeDataSummary />

      <HStack wrap={"wrap"} gap={PADDING.sm}>
        <MitraHomeCartSummary flex={"1 1 300px"} />
        <MitraHomeFinancialFlow flex={"1 1 500px"} />
        <MitraHomeLastTransaction flex={"1 1 100%"} />
      </HStack>
    </PanelContentContainer>
  );
};

export const HomePage = MitraHomePage;
