// src/features/mitra/home/pages/mitra.home.page.tsx

import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { MitraHomeCartSummary } from "@/features/mitra/home/components/mitra.home.cart-summary";
import { MitraHomeDataAvailability } from "@/features/mitra/home/components/mitra.home.data-availability";
import { MitraHomeDataSummary } from "@/features/mitra/home/components/mitra.home.data-summary";
import { MitraHomeFinancialFlow } from "@/features/mitra/home/components/mitra.home.financial-flow";
import { MitraHomeLastTransaction } from "@/features/mitra/home/components/mitra.home.last-transaction";
import { useMitraHomeData } from "@/features/mitra/home/hooks/use-mitra-home.query";

export const MitraHomePage = () => {
  // Queries / Data
  const { isLoading } = useMitraHomeData();

  if (isLoading) {
    return (
      <PanelContentContainer h={"auto"}>
        <Skeleton h={"140px"} w={"full"} />
        <Skeleton h={"233px"} w={"full"} />

        <HStack wrap={"wrap"} gap={"sm"} w={"full"}>
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
      position={"relative"}
    >
      <MitraHomeDataAvailability />

      <MitraHomeDataSummary />

      <HStack wrap={"wrap"} gap={"sm"}>
        <MitraHomeCartSummary flex={"1 1 300px"} />
        <MitraHomeFinancialFlow flex={"1 1 500px"} />
        <MitraHomeLastTransaction flex={"1 1 100%"} />
      </HStack>
    </PanelContentContainer>
  );
};

export const HomePage = MitraHomePage;
