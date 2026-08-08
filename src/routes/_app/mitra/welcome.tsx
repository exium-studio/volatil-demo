// src/routes/_app/mitra/welcome.tsx

import { WelcomeState } from "@/design-system/components/feedback/ui/state.welcome";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/mitra/welcome")({
  component: RouteComponent,
});

function RouteComponent() {
  return <WelcomeState />;
}
