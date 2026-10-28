// src/routes/index.tsx

import { MitraSigninPage } from "@/features/auth/pages/mitra.signin.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <MitraSigninPage />;
}
