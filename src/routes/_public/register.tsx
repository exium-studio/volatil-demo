// src/routes/_public/register.tsx

import { MitraRegisterPage } from "@/features/auth/pages/mitra-register.page";
import { redirectIfAuthenticated } from "@/features/auth/services/auth-guard.service";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/register")({
  beforeLoad: async () => {
    await redirectIfAuthenticated();
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <MitraRegisterPage />;
}
