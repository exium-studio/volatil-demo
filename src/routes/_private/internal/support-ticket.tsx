// src/routes/_private/internal/support-ticket.tsx

import { SupportTicketPage } from "@/features/mitra/support-ticket/pages/support-ticket.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/internal/support-ticket")({
  component: RouteComponent,
});

function RouteComponent() {
  return <SupportTicketPage />;
}
