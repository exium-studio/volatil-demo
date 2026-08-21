import { redirectIfAuthenticated } from "@/features/auth/services/auth-guard.service";
import { MitraSigninPage } from "@/features/auth/pages/mitra.signin.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    await redirectIfAuthenticated();
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <MitraSigninPage />;
}
