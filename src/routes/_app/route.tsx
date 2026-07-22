// src/routes/_app/route.tsx

import { GisAppShell } from "@/design-system/components/shell/ui/gis-app-shell";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
});

function RouteComponent() {
  return <GisAppShell />;
}
