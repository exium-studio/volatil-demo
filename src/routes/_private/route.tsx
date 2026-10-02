// src/routes/_private/route.tsx

import { ensureAuthenticatedUser } from "@/features/auth/services/auth-guard.service";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_private")({
  beforeLoad: async () => {
    await ensureAuthenticatedUser();
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
