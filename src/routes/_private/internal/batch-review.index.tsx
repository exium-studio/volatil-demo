// src/routes/_private/internal/batch-review.index.tsx

import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { InternalBatchReviewPage } from "@/features/internal/batch-review/pages/internal.batch-review.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/internal/batch-review/")({
  beforeLoad: async () => {
    await requireRoleGuard("internal");
  },
  component: InternalBatchReviewPage,
});
