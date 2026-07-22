// src/routes/_app/portal/cart.tsx

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/portal/cart')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/portal/cart"!</div>
}
