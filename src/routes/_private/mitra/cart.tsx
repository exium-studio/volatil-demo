import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { MitraCartPage } from "@/features/mitra/cart/pages/mitra.cart.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/mitra/cart")({
  beforeLoad: async () => {
    await requireRoleGuard("mitra");
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <MitraCartPage />;
}
