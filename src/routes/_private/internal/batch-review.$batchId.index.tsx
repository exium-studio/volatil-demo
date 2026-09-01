// src/routes/_private/internal/batch-review.$batchId.index.tsx

import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { InternalBatchReviewDetailPage } from "@/features/internal/batch-review/pages/internal.batch-review.detail.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/internal/batch-review/$batchId/")({
  beforeLoad: async () => {
    await requireRoleGuard("internal");
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <InternalBatchReviewDetailPage />;
}

