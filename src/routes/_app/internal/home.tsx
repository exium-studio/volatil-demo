// src/routes/_app/internal/home.tsx

import { MitraHomePage } from "@/features/mitra/home/pages/mitra.home.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/internal/home")({
  component: RouteComponent,
});

function RouteComponent() {
  return <MitraHomePage />;
}
