import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { MitraHomePage } from "@/features/mitra/home/pages/mitra.home.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/mitra/home")({
  beforeLoad: async () => {
    await requireRoleGuard("mitra");
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <MitraHomePage />;
}
