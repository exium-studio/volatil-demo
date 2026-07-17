// src/routes/demo.tsx

import { DemoPage } from "@/features/root/components/demo.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/demo")({
  component: RouteComponent,
});

function RouteComponent() {
  return <DemoPage />;
}
