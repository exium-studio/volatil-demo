// src/routes/_private/mitra/billing.$billingCode.tsx

import { BillingPage } from "@/features/mitra/billing/pages/billing.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/mitra/billing/$billingCode")({
  component: RouteComponent,
});

function RouteComponent() {
  return <BillingPage />;
}
