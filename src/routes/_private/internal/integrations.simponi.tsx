// src/routes/_private/internal/integrations.simponi.tsx

import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { InternalIntegrationsSimponiPage } from "@/features/internal/integrations/pages/internal.integrations-simponi.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/internal/integrations/simponi")({
  beforeLoad: async () => {
    await requireRoleGuard("internal");
  },
  component: InternalIntegrationsSimponiPage,
});
