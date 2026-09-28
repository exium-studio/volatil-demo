import { GisAppShell } from "@/design-system/components/shell/ui/gis-app-shell";
import { ensureAuthenticatedUser } from "@/features/auth/services/auth-guard.service";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private")({
  beforeLoad: async () => {
    await ensureAuthenticatedUser();
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <GisAppShell />;
}
