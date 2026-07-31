// src/features/home/pages/home.page.tsx

import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { PADDING_SM } from "@/design-system/constants/styles";
import { HomeCartSummary } from "@/features/home/components/home.cart-summary";
import { HomeDataSummary } from "@/features/home/components/home.data-summary";
import { HomeFinancialFlow } from "@/features/home/components/home.financial-flow";
import { HomeLastTransaction } from "@/features/home/components/home.last-transaction";

export const HomePage = () => {
  return (
    <PanelContentContainer gap={PADDING_SM} pb={PADDING_SM}>
      <HomeDataSummary />

      <HStack wrap={"wrap"} gap={PADDING_SM} px={PADDING_SM}>
        <HomeCartSummary />
        <HomeFinancialFlow />
        <HomeLastTransaction />
      </HStack>
    </PanelContentContainer>
  );
};
