// src/routes/_private/mitra/my-data.index.tsx

import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { MitraMyDataPage } from "@/features/mitra/my-data/pages/mitra.my-data.page";
import type {
  MitraMyDataSearch,
  WorkspaceActiveStatus,
} from "@/features/mitra/my-data/types/my-data.type";
import { createFileRoute } from "@tanstack/react-router";

const VALID_ACTIVE_STATUSES: WorkspaceActiveStatus[] = [
  "all",
  "active",
  "almost_expired",
  "expired",
];

export const Route = createFileRoute("/_private/mitra/my-data/")({
  validateSearch: (search: Record<string, unknown>): MitraMyDataSearch => {
    const rawStatus = search.activeStatus;
    const isValidStatus =
      typeof rawStatus === "string" &&
      VALID_ACTIVE_STATUSES.includes(rawStatus as WorkspaceActiveStatus);

    return {
      activeStatus: isValidStatus
        ? (rawStatus as WorkspaceActiveStatus)
        : undefined,
    };
  },
  beforeLoad: async () => {
    await requireRoleGuard("mitra");
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <MitraMyDataPage />;
}
