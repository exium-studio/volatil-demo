// src/routes/index.lazy.tsx

import { AuthPage } from "@/features/auth/auth.page";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AuthPage />;
}
