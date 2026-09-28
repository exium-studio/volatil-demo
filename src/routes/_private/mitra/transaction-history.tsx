import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { MitraTransactionHistoryPage } from "@/features/mitra/transaction-history/pages/mitra.transaction-history.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/mitra/transaction-history")({
  beforeLoad: async () => {
    await requireRoleGuard("mitra");
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <MitraTransactionHistoryPage />;
}
