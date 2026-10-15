// src/routes/_private/internal/mitra-registration.index.tsx

import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { InternalMitraRegistrationPage } from "@/features/internal/mitra-registration/pages/internal.mitra-registration.page";
import type {
  InternalMitraRegistrationSearch,
  MitraRegistrationStatus,
} from "@/features/internal/mitra-registration/types/mitra-registration.type";
import { createFileRoute } from "@tanstack/react-router";

const VALID_STATUSES: (MitraRegistrationStatus | "all")[] = [
  "all",
  "pending_verification",
  "verified",
  "approved",
  "rejected",
];

export const Route = createFileRoute("/_private/internal/mitra-registration/")({
  validateSearch: (
    search: Record<string, unknown>,
  ): InternalMitraRegistrationSearch => {
    const rawStatus = search.status;
    const isValidStatus =
      typeof rawStatus === "string" &&
      VALID_STATUSES.includes(rawStatus as MitraRegistrationStatus | "all");

    return {
      status: isValidStatus
        ? (rawStatus as MitraRegistrationStatus | "all")
        : undefined,
    };
  },
  beforeLoad: async () => {
    await requireRoleGuard("internal");
  },
  component: InternalMitraRegistrationPage,
});
