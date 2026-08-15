// src/routes/_public/admin.tsx

import { InternalSigninPage } from "@/features/auth/pages/internal.signin.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/admin")({
  component: RouteComponent,
});

function RouteComponent() {
  return <InternalSigninPage />;
}
