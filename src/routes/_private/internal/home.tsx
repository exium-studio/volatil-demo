import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { InternalHomePage } from "@/features/internal/home/pages/internal.home.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/internal/home")({
  beforeLoad: async () => {
    await requireRoleGuard("internal");
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <InternalHomePage />;
}
