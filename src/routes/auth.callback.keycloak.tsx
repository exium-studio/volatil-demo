// src/routes/auth.callback.keycloak.tsx

// src\routes\auth.callback.keycloak.tsx

// src\routes\auth.callback.keycloak.tsx

import { SsoCallbackPage } from "@/features/auth/pages/sso-callback.page";
import type { SsoCallbackSearch } from "@/features/auth/types/sso.type";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/callback/keycloak")({
  validateSearch: (search: Record<string, unknown>): SsoCallbackSearch => {
    return {
      code: typeof search.code === "string" ? search.code : undefined,
      state: typeof search.state === "string" ? search.state : undefined,
      session_state:
        typeof search.session_state === "string"
          ? search.session_state
          : undefined,
      error: typeof search.error === "string" ? search.error : undefined,
      error_description:
        typeof search.error_description === "string"
          ? search.error_description
          : undefined,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <SsoCallbackPage />;
}
