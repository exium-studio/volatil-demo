// src/routes/_private/internal/user-management.tsx

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/internal/user-management')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/admin/user-management"!</div>
}
