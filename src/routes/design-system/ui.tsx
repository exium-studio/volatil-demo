// src/routes/design-system/ui.tsx

import { DesignSystemDocsPage } from "@/features/design-system-docs/components/design-system-docs.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/design-system/ui")({
  component: RouteComponent,
});

function RouteComponent() {
  return <DesignSystemDocsPage />;
}
