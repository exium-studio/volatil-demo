// src/routes/_private/internal/mitra-registration.index.tsx

import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { InternalMitraRegistrationPage } from "@/features/internal/mitra-registration/pages/internal.mitra-registration.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/internal/mitra-registration/")({
  beforeLoad: async () => {
    await requireRoleGuard("internal");
  },
  component: InternalMitraRegistrationPage,
});
