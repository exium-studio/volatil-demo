// src/routes/index.lazy.tsx

import { SigninPage } from "@/features/auth/pages/signin.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <SigninPage />;
}
