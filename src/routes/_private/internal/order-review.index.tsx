// src/routes/_private/internal/order-review.index.tsx

import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { InternalOrderReviewPage } from "@/features/internal/order-review/pages/internal.order-review.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/internal/order-review/")({
  beforeLoad: async () => {
    await requireRoleGuard("internal");
  },
  component: InternalOrderReviewPage,
});
