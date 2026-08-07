// src/routes/_app/internal/welcome.tsx

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/internal/welcome")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_app/admin/welcome"!</div>;
}
