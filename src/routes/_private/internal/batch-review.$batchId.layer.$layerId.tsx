// src/routes/_private/internal/batch-review.$batchId.layer.$layerId.tsx

import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { InternalBatchReviewLayerDetailPage } from "@/features/internal/batch-review/pages/internal.batch-review.layer-detail.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_private/internal/batch-review/$batchId/layer/$layerId",
)({
  beforeLoad: async () => {
    await requireRoleGuard("internal");
  },
  component: InternalBatchReviewLayerDetailPage,
});
