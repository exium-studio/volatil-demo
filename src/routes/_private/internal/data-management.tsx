// src/routes/_private/internal/data-management.tsx

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/internal/data-management")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_app/admin/data-management"!</div>;
}
