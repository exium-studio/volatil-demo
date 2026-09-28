// src/routes/_private/internal/jobs.tsx

import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { InternalMitraLayerSyncJobsPage } from "@/features/internal/mitra-layer-sync-jobs/pages/internal.mitra-layer-sync-jobs.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/internal/jobs")({
  beforeLoad: async () => {
    await requireRoleGuard("internal");
  },
  component: InternalMitraLayerSyncJobsPage,
});
