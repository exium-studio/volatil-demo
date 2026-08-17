// src/routes/_private/internal/notification.tsx

import { NotificationPage } from "@/features/notification/pages/notification.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/internal/notification")({
  component: RouteComponent,
});

function RouteComponent() {
  return <NotificationPage />;
}
