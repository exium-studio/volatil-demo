// src/routes/_app/mitra/cart.tsx

import { MitraCartPage } from "@/features/cart/pages/mitra.cart.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/mitra/cart")({
  component: RouteComponent,
});

function RouteComponent() {
  return <MitraCartPage />;
}
