// src/routes/_app/mitra/cart.tsx

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/mitra/cart')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/portal/cart"!</div>
}
