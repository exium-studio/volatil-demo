// src/routes/_app/mitra/my-data.tsx

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/mitra/my-data')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/portal/my-data"!</div>
}
