// src/routes/_app/mitra/notification.tsx

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/mitra/notification")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_app/portal/notification"!</div>;
}
