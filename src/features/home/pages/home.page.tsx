// src/features/home/pages/home.page.tsx

import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { PADDING_SM } from "@/design-system/constants/styles";
import { CartSummary } from "@/features/home/components/home.cart-summary";
import { DataSummary } from "@/features/home/components/home.data-summary";

export const HomePage = () => {
  return (
    <PanelContentContainer gap={PADDING_SM}>
      <DataSummary />

      <HStack wrap={"wrap"}>
        <CartSummary />
      </HStack>
    </PanelContentContainer>
  );
};
