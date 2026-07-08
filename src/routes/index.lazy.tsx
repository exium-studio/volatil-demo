// src/routes/index.lazy.tsx

import { RootPage } from "@/features/root/components/root.page";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <RootPage />;
}
