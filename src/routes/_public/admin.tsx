import { redirectIfAuthenticated } from "@/features/auth/services/auth-guard.service";
import { InternalSigninPage } from "@/features/auth/pages/internal.signin.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/admin")({
  beforeLoad: async () => {
    await redirectIfAuthenticated();
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <InternalSigninPage />;
}
