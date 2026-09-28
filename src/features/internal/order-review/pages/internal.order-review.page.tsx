import { AppContentContainer } from "@/design-system/components/layout/ui/page-container";
import { InternalOrderReviewDataView } from "@/features/internal/order-review/components/internal.order-review.data-view";

export const InternalOrderReviewPage = () => {
  return (
    <AppContentContainer h={"auto"} position={"relative"}>
      <InternalOrderReviewDataView />
    </AppContentContainer>
  );
};
