// src/routes/_app/mitra/support-ticket.tsx

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/mitra/support-ticket")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_app/portal/support-ticket"!</div>;
}
