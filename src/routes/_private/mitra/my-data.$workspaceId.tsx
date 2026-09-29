// src/routes/_private/mitra/my-data.$workspaceId.tsx

import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { MitraMyDataWorkspaceDetailPage } from "@/features/mitra/my-data/pages/mitra.my-data.workspace-detail.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/mitra/my-data/$workspaceId")({
  beforeLoad: async () => {
    await requireRoleGuard("mitra");
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <MitraMyDataWorkspaceDetailPage />;
}
