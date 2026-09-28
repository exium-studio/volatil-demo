// src/routes/design-system/ui.tsx

import { DesignSystemDocsPage } from "@/features/design-system-docs/components/design-system-docs.page";
import type { DsDocsSearchParams } from "@/features/design-system-docs/types/ds-docs-navs.type";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const dsDocsSearchSchema = z.object({
  component: z.string().optional(),
});

export const Route = createFileRoute("/design-system/ui")({
  validateSearch: (search: Record<string, unknown>): DsDocsSearchParams =>
    dsDocsSearchSchema.parse(search),
  component: RouteComponent,
});

function RouteComponent() {
  return <DesignSystemDocsPage />;
}
