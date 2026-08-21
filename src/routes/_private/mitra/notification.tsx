import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { NotificationPage } from "@/features/notification/pages/notification.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/mitra/notification")({
  beforeLoad: async () => {
    await requireRoleGuard("mitra");
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <NotificationPage />;
}
