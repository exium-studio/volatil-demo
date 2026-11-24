// src/routes/_private/internal/security-monitoring.tsx

import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { InternalSecurityMonitoringPage } from "@/features/internal/security-monitoring/pages/internal.security-monitoring.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/internal/security-monitoring")({
  beforeLoad: async () => {
    await requireRoleGuard("internal");
  },
  component: InternalSecurityMonitoringPage,
});
