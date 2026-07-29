// src/routes/_app/portal/home.tsx

import { HomePage } from "@/features/home/pages/home.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/portal/home")({
  component: RouteComponent,
});

function RouteComponent() {
  return <HomePage />;
}
