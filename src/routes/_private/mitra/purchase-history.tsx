import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/mitra/purchase-history")({
  beforeLoad: async () => {
    await requireRoleGuard("mitra");
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_app/portal/purchase-history"!</div>;
}
