// src/routes/_private/internal/integrations.smtp.tsx

import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { InternalIntegrationsSmtpPage } from "@/features/internal/integrations/pages/internal.integrations-smtp.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/internal/integrations/smtp")({
  beforeLoad: async () => {
    await requireRoleGuard("internal");
  },
  component: InternalIntegrationsSmtpPage,
});
