// src/routes/_private/internal/master-igt-layer.index.tsx

import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { InternalMasterIgtLayerPage } from "@/features/internal/master-igt-layer/pages/internal.master-igt-layer.page";
import type {
  IgtBasisType,
  MasterIgtLayerSearch,
} from "@/features/internal/master-igt-layer/types/master-igt-layer.type";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/internal/master-igt-layer/")({
  validateSearch: (
    search: Record<string, unknown>,
  ): MasterIgtLayerSearch => {
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
  return <InternalMasterIgtLayerPage />;
}
