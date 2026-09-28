import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { BillingPage } from "@/features/mitra/billing/pages/billing.page";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const billingSearchSchema = z.object({
  orderId: z.string().optional(),
});

export const Route = createFileRoute("/_private/mitra/billing/$billingCode")({
  validateSearch: (search) => billingSearchSchema.parse(search),
  beforeLoad: async () => {
    await requireRoleGuard("mitra");
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <BillingPage />;
}
