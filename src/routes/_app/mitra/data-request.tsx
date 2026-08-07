// src/routes/_app/mitra/data-request.tsx

import { MitraDataRequestPage } from "@/features/mitra/data-request/pages/mitra.data-request.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/mitra/data-request")({
  component: RouteComponent,
});

function RouteComponent() {
  return <MitraDataRequestPage />;
}
