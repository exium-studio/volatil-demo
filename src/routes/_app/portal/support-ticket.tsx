// src/routes/_app/portal/support-ticket.tsx

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/portal/support-ticket")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_app/portal/support-ticket"!</div>;
}
