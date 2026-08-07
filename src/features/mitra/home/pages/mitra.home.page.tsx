// src/features/mitra/home/pages/mitra.home.page.tsx

import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { PADDING_SM } from "@/design-system/constants/styles";
import { MitraHomeCartSummary } from "@/features/mitra/home/components/mitra.home.cart-summary";
import { MitraHomeDataSummary } from "@/features/mitra/home/components/mitra.home.data-summary";
import { MitraHomeFinancialFlow } from "@/features/mitra/home/components/mitra.home.financial-flow";
import { MitraHomeLastTransaction } from "@/features/mitra/home/components/mitra.home.last-transaction";

export const MitraHomePage = () => {
  return (
    <PanelContentContainer h={"auto"} gap={PADDING_SM} p={PADDING_SM}>
      <MitraHomeDataSummary />

      <HStack wrap={"wrap"} gap={PADDING_SM}>
        <MitraHomeCartSummary />
        <MitraHomeFinancialFlow />
        <MitraHomeLastTransaction />
      </HStack>
    </PanelContentContainer>
  );
};

export const HomePage = MitraHomePage;
