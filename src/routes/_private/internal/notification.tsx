// src/routes/_private/internal/notification.tsx

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/internal/notification")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_app/admin/notification"!</div>;
}
