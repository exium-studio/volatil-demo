// src/features/internal/pricing/pages/internal.pricing.page.tsx

import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { InternalPricingDataList } from "@/features/internal/pricing/components/internal.pricing.data-list";

export const InternalPricingPage = () => {
  return (
    <PanelContentContainer h={"auto"} position={"relative"}>
      <InternalPricingDataList />
    </PanelContentContainer>
  );
};
