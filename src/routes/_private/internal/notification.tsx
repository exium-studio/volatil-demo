import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { NotificationPage } from "@/features/notification/pages/notification.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/internal/notification")({
  beforeLoad: async () => {
    await requireRoleGuard("internal");
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <NotificationPage />;
}
