// src/routes/_app/internal/order-statistic.tsx

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/internal/order-statistic")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_app/admin/order-statistic"!</div>;
}
