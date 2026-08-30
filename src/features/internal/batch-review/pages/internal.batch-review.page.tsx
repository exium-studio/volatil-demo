// src/features/internal/batch-review/pages/internal.batch-review.page.tsx

import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { InternalBatchReviewDataView } from "@/features/internal/batch-review/components/internal.batch-review.data-view";

export const InternalBatchReviewPage = () => {
  return (
    <PanelContentContainer h={"auto"} position={"relative"}>
      <InternalBatchReviewDataView />
    </PanelContentContainer>
  );
};
