// src/routes/index.lazy.tsx

import { SigninPage } from "@/features/auth/pages/signin.page";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <SigninPage />;
}
