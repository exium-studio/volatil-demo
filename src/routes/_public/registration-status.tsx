// src/routes/_public/registration-status.tsx

import { MitraRegistrationStatusPage } from "@/features/auth/pages/mitra-registration-status.page";
import { redirectIfAuthenticated } from "@/features/auth/services/auth-guard.service";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/registration-status")({
  beforeLoad: async () => {
    await redirectIfAuthenticated();
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <MitraRegistrationStatusPage />;
}
