import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { BillingPage } from "@/features/mitra/billing/pages/billing.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/mitra/billing/$billingCode")({
  beforeLoad: async () => {
    await requireRoleGuard("mitra");
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <BillingPage />;
}
