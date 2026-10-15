// src/routes/_private/mitra/my-data.index.tsx

import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { MitraMyDataPage } from "@/features/mitra/my-data/pages/mitra.my-data.page";
import { createFileRoute } from "@tanstack/react-router";

import { z } from "zod";

const myDataSearchSchema = z.object({
  activeStatus: z.enum(["all", "active", "almost_expired", "expired"]).optional(),
});

export const Route = createFileRoute("/_private/mitra/my-data/")({
  validateSearch: (search) => myDataSearchSchema.parse(search),
  beforeLoad: async () => {
    await requireRoleGuard("mitra");
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <MitraMyDataPage />;
}
