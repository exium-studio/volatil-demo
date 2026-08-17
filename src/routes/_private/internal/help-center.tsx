// src/routes/_private/internal/help-center.tsx

import { HelpCenterPage } from "@/features/mitra/help-center/pages/help-center.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/internal/help-center")({
  component: RouteComponent,
});

function RouteComponent() {
  return <HelpCenterPage />;
}
