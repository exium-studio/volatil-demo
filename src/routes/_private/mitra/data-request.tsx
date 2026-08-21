import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { MitraDataRequestPage } from "@/features/mitra/data-request/pages/mitra.data-request.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/mitra/data-request")({
  beforeLoad: async () => {
    await requireRoleGuard("mitra");
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <MitraDataRequestPage />;
}
