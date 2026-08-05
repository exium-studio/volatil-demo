// src/routes/_app/admin/home.tsx

import { HomePage } from "@/features/home/pages/home.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/admin/home")({
  component: RouteComponent,
});

function RouteComponent() {
  return <HomePage />;
}
