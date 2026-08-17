// src/routes/_private/mitra/support-ticket.tsx

import { SupportTicketPage } from "@/features/mitra/support-ticket/pages/support-ticket.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/mitra/support-ticket")({
  component: RouteComponent,
});

function RouteComponent() {
  return <SupportTicketPage />;
}
