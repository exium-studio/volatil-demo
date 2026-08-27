// src/features/internal/pricing/pages/internal.pricing.page.tsx

import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { InternalPricingDataView } from "@/features/internal/pricing/components/internal.pricing.data-view";

export const InternalPricingPage = () => {
  return (
    <PanelContentContainer h={"auto"} position={"relative"}>
      <InternalPricingDataView />
    </PanelContentContainer>
  );
};
