import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { InternalUserManagementPage } from "@/features/internal/user-management/pages/internal.user-management.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/internal/user-management")({
  beforeLoad: async () => {
    await requireRoleGuard("internal");
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <InternalUserManagementPage />;
}
