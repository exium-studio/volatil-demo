// src/routes/_app/portal/my-data.tsx

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/portal/my-data')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/portal/my-data"!</div>
}
