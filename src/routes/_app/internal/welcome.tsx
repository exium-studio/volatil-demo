// src/routes/_app/internal/welcome.tsx

import { WelcomeState } from "@/design-system/components/feedback/ui/state.welcome";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/internal/welcome")({
  component: RouteComponent,
});

function RouteComponent() {
  return <WelcomeState />;
}
