// src/features/internal/order-review/pages/internal.order-review.page.tsx

import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { InternalOrderReviewDataView } from "@/features/internal/order-review/components/internal.order-review.data-view";

export const InternalOrderReviewPage = () => {
  return (
    <PanelContentContainer h={"auto"} position={"relative"}>
      <InternalOrderReviewDataView />
    </PanelContentContainer>
  );
};
