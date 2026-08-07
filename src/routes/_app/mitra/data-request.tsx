// src/routes/_app/portal/data-request.tsx

import { DataRequestPage } from "@/features/data-request/pages/data-request.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/mitra/data-request")({
  component: RouteComponent,
});

function RouteComponent() {
  return <DataRequestPage />;
}
