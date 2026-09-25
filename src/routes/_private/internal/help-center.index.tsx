// src\routes\_private\internal\help-center.index.tsx

import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { HelpCenterPage } from "@/features/help-center/pages/help-center.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/internal/help-center/")({
  beforeLoad: async () => {
    await requireRoleGuard("internal");
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <HelpCenterPage />;
}
