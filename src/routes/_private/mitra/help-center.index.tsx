import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { HelpCenterPage } from "@/features/mitra/help-center/pages/help-center.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/mitra/help-center/")({
  beforeLoad: async () => {
    await requireRoleGuard("mitra");
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <HelpCenterPage />;
}
