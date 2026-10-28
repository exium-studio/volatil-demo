// src/routes/demo.tsx

import { SsoCallbackPage } from "@/features/auth/pages/sso-callback.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/demo")({
  component: RouteComponent,
});

function RouteComponent() {
  return <SsoCallbackPage />;
}
