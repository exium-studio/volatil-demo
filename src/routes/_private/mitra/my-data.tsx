// src/routes/_private/mitra/my-data.tsx

import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/mitra/my-data")({
  beforeLoad: async () => {
    await requireRoleGuard("mitra");
  },
  component: () => <Outlet />,
});
