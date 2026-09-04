// src/routes/_private/internal/order-review.$orderId.layer.$layerId.tsx

import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { InternalOrderReviewLayerDetailPage } from "@/features/internal/order-review/pages/internal.order-review.layer-detail.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_private/internal/order-review/$orderId/layer/$layerId",
)({
  beforeLoad: async () => {
    await requireRoleGuard("internal");
  },
  component: InternalOrderReviewLayerDetailPage,
});
