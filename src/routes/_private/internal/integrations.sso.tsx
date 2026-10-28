// src/routes/_private/internal/integrations.sso.tsx

import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { InternalIntegrationsSsoPage } from "@/features/internal/integrations/pages/internal.integrations-sso.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/internal/integrations/sso")({
  beforeLoad: async () => {
    await requireRoleGuard("internal");
  },
  component: InternalIntegrationsSsoPage,
});
