// src/routes/_app/mitra/purchase-history.tsx

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/mitra/purchase-history')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/portal/purchase-history"!</div>
}
