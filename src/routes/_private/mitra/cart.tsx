// src/routes/_private/mitra/cart.tsx

import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { MitraCartPage } from "@/features/mitra/cart/pages/mitra.cart.page";
import type { MitraCartSearch } from "@/features/mitra/cart/types/cart.type";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/mitra/cart")({
  validateSearch: (search: Record<string, unknown>): MitraCartSearch => ({
    orderId: typeof search.orderId === "string" ? search.orderId : undefined,
  }),
  beforeLoad: async () => {
    await requireRoleGuard("mitra");
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <MitraCartPage />;
}
