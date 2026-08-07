// src/features/internal/home/pages/internal.home.page.tsx

import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { PADDING_SM } from "@/design-system/constants/styles";
import { InternalHomeDataList } from "@/features/internal/home/components/internal.home.data-list";
import { InternalHomeDataSummary } from "@/features/internal/home/components/internal.home.data-summary";
import { InternalHomeOrderSummary } from "@/features/internal/home/components/internal.home.order-summary";
import { InternalHomeServiceRate } from "@/features/internal/home/components/internal.home.service-rate";

export const InternalHomePage = () => {
  return (
    <PanelContentContainer h={"auto"} gap={PADDING_SM} p={PADDING_SM}>
      <HStack wrap={"wrap"} gap={PADDING_SM}>
        <InternalHomeDataSummary />
        <InternalHomeServiceRate />
      </HStack>

      <InternalHomeOrderSummary />

      <InternalHomeDataList />
    </PanelContentContainer>
  );
};
