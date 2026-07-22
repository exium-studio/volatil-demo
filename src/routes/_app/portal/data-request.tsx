// src/routes/_app/portal/data-request.tsx

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/portal/data-request")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_app/portal/date-request"!</div>;
}
