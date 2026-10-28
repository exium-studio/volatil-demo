// src/routes/_private/internal/data-management.index.tsx

import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { InternalDataManagementPage } from "@/features/internal/data-management/pages/internal.data-management.page";
import type {
  IgtBasisType,
  MasterIgtDataManagementSearch,
} from "@/features/internal/data-management/types/data-management.type";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/internal/data-management/")({
  validateSearch: (
    search: Record<string, unknown>,
  ): MasterIgtDataManagementSearch => {
    const rawBasis = search.basisIgt;
    const isValidBasis =
      rawBasis === "bidang" || rawBasis === "kawasan";

    return {
      basisIgt: isValidBasis ? (rawBasis as IgtBasisType) : undefined,
      isActive: search.isActive as string | number | boolean | undefined,
    };
  },
  beforeLoad: async () => {
    await requireRoleGuard("internal");
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <InternalDataManagementPage />;
}
