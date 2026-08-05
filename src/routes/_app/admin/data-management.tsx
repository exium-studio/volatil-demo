// src/routes/_app/admin/data-management.tsx

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/admin/data-management")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_app/admin/data-management"!</div>;
}
