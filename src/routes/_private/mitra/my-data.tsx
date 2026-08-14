// src/routes/_app/mitra/my-data.tsx

import { MitraMyDataPage } from "@/features/mitra/my-data/pages/mitra.my-data.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/mitra/my-data")({
  component: RouteComponent,
});

function RouteComponent() {
  return <MitraMyDataPage />;
}
