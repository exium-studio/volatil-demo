// src/routes/_private/mitra/help-center.$ticketId.tsx

import { HelpCenterDetailPage } from "@/features/mitra/help-center/pages/help-center.detail.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/mitra/help-center/$ticketId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <HelpCenterDetailPage />;
}
