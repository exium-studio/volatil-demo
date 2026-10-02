// src/routes/_private/mitra/my-data.$workspaceId.tsx

import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { MitraMyDataWorkspaceDetailPage } from "@/features/mitra/my-data/pages/mitra.my-data.workspace-detail.page";
import type { MitraMyDataWorkspaceDetailSearch } from "@/features/mitra/my-data/types/my-data.type";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/mitra/my-data/$workspaceId")({
  validateSearch: (
    search: Record<string, unknown>,
  ): MitraMyDataWorkspaceDetailSearch => ({
    layerId: typeof search.layerId === "string" ? search.layerId : undefined,
  }),
  beforeLoad: async () => {
    await requireRoleGuard("mitra");
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <MitraMyDataWorkspaceDetailPage />;
}

