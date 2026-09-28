// src/routes/_private/internal/mitra-registration.$registrationId.tsx

import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { InternalMitraRegistrationDetailPage } from "@/features/internal/mitra-registration/pages/internal.mitra-registration.detail.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_private/internal/mitra-registration/$registrationId",
)({
  beforeLoad: async () => {
    await requireRoleGuard("internal");
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <InternalMitraRegistrationDetailPage />;
}

