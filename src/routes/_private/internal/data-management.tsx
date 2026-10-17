// src/routes/_private/internal/data-management.tsx

import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/internal/data-management")({
  beforeLoad: async () => {
    await requireRoleGuard("internal");
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
