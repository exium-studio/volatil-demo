import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { MitraPurchaseHistoryPage } from "@/features/mitra/purchase-history/pages/mitra.purchase-history.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/mitra/purchase-history")({
  beforeLoad: async () => {
    await requireRoleGuard("mitra");
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <MitraPurchaseHistoryPage />;
}
