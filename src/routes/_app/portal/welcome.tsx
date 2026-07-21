// src/routes/_app/portal/welcome.tsx

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/portal/welcome")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_app/portal/welcome"!</div>;
}
