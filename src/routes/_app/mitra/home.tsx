// src/routes/_app/mitra/home.tsx

import { MitraHomePage } from "@/features/mitra/home/pages/mitra.home.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/mitra/home")({
  component: RouteComponent,
});

function RouteComponent() {
  return <MitraHomePage />;
}
