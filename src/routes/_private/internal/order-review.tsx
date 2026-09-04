// src/routes/_private/internal/order-review.tsx

import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/internal/order-review")({
  beforeLoad: async () => {
    await requireRoleGuard("internal");
  },
  component: () => <Outlet />,
});
