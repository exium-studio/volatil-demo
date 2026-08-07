// src/routes/_app/internal/notification.tsx

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/internal/notification")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_app/admin/notification"!</div>;
}
