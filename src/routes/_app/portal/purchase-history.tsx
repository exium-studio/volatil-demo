// src/routes/_app/portal/purchase-history.tsx

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/portal/purchase-history')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/portal/purchase-history"!</div>
}
