// src/routes/_private/mitra/notification.tsx

import { NotificationPage } from "@/features/notification/pages/notification.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/mitra/notification")({
  component: RouteComponent,
});

function RouteComponent() {
  return <NotificationPage />;
}
