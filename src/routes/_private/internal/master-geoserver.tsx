// src/routes/_private/internal/master-geoserver.tsx

import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { InternalMasterGeoserverPage } from "@/features/internal/master-geoserver/pages/internal.master-geoserver.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/internal/master-geoserver")({
  beforeLoad: async () => {
    await requireRoleGuard("internal");
  },
  component: InternalMasterGeoserverPage,
});
