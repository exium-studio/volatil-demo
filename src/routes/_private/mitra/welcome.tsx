import { WelcomeState } from "@/design-system/components/feedback/ui/state.welcome";
import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/mitra/welcome")({
  beforeLoad: async () => {
    await requireRoleGuard("mitra");
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <WelcomeState />;
}
