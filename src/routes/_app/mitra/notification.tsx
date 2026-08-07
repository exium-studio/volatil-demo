// src/routes/_app/portal/notification.tsx

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/mitra/notification")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_app/portal/notification"!</div>;
}
