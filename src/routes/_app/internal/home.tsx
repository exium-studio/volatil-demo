// src/routes/_app/internal/home.tsx

import { InternalHomePage } from "@/features/internal/home/pages/internal.home.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/internal/home")({
  component: RouteComponent,
});

function RouteComponent() {
  return <InternalHomePage />;
}
