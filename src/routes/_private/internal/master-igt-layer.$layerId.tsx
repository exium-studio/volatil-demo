// src/routes/_private/internal/master-igt-layer.$layerId.tsx

import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { InternalMasterIgtLayerDetailPage } from "@/features/internal/master-igt-layer/pages/internal.master-igt-layer.detail.page";
import type { MasterIgtLayerDetailSearch } from "@/features/internal/master-igt-layer/types/master-igt-layer.type";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_private/internal/master-igt-layer/$layerId",
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
  return <InternalMasterIgtLayerDetailPage />;
}
