// src\routes\_private\internal\help-center.$ticketId.tsx

import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { HelpCenterDetailPage } from "@/features/help-center/pages/help-center.detail.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_private/internal/help-center/$ticketId",
)({
  beforeLoad: async () => {
    await requireRoleGuard("internal");
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <HelpCenterDetailPage />;
}
