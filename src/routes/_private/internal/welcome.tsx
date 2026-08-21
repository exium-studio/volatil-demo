import { WelcomeState } from "@/design-system/components/feedback/ui/state.welcome";
import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/internal/welcome")({
  beforeLoad: async () => {
    await requireRoleGuard("internal");
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <WelcomeState />;
}
