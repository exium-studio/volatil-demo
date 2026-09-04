// src/routes/_private/internal/order-review.$orderId.index.tsx

import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { InternalOrderReviewDetailPage } from "@/features/internal/order-review/pages/internal.order-review.detail.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/internal/order-review/$orderId/")({
  beforeLoad: async () => {
    await requireRoleGuard("internal");
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <InternalOrderReviewDetailPage />;
}
