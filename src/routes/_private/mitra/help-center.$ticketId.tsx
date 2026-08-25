import { requireAuthenticatedGuard } from "@/features/auth/services/auth-guard.service";
import { HelpCenterDetailPage } from "@/features/mitra/help-center/pages/help-center.detail.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/mitra/help-center/$ticketId")({
  beforeLoad: async () => {
    await requireAuthenticatedGuard();
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <HelpCenterDetailPage />;
}
