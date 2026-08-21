import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { MitraMyDataPage } from "@/features/mitra/my-data/pages/mitra.my-data.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/mitra/my-data")({
  beforeLoad: async () => {
    await requireRoleGuard("mitra");
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <MitraMyDataPage />;
}
