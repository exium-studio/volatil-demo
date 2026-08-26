// src/routes/_private/internal/data-management.tsx

import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { InternalDataManagementPage } from "@/features/internal/data-management/pages/internal.data-management.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/internal/data-management")({
  beforeLoad: async () => {
    await requireRoleGuard("internal");
  },
  component: InternalDataManagementPage,
});
