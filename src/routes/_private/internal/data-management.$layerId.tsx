// src/routes/_private/internal/data-management.$layerId.tsx

import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { InternalDataManagementDetailPage } from "@/features/internal/data-management/pages/internal.data-management.detail.page";
import type { MasterIgtLayerDetailSearch } from "@/features/internal/data-management/types/data-management.type";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_private/internal/data-management/$layerId",
)({
  validateSearch: (
    search: Record<string, unknown>,
  ): MasterIgtLayerDetailSearch => {
    const rawTab = search.tab;
    const isValidTab = rawTab === "config" || rawTab === "attribute";

    return {
      tab: isValidTab ? (rawTab as "config" | "attribute") : undefined,
    };
  },
  beforeLoad: async () => {
    await requireRoleGuard("internal");
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <InternalDataManagementDetailPage />;
}
