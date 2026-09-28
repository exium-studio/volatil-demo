import { InternalSigninPage } from "@/features/auth/pages/internal.signin.page";
import type { AdminSigninSearch } from "@/features/auth/types/signin.type";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/admin")({
  validateSearch: (search: Record<string, unknown>): AdminSigninSearch => {
    return {
      error: typeof search.error === "string" ? search.error : undefined,
      reason: typeof search.reason === "string" ? search.reason : undefined,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <InternalSigninPage />;
}
