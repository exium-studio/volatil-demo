import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { InternalTransactionStatisticPage } from "@/features/internal/statistik-pesanan/pages/internal.transaction-statistic.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/internal/order-statistic")({
  beforeLoad: async () => {
    await requireRoleGuard("internal");
  },
  component: InternalTransactionStatisticPage,
});
