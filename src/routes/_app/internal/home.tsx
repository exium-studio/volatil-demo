// src/routes/_app/internal/home.tsx

import { HomePage } from "@/features/mitra/home/pages/home.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/internal/home")({
  component: RouteComponent,
});

function RouteComponent() {
  return <HomePage />;
}
