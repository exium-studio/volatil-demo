// src/routes/_private/internal/user-management.tsx

import { createFileRoute } from '@tanstack/react-router'
import { InternalUserManagementPage } from '@/features/internal/user-management/pages/internal.user-management.page'

export const Route = createFileRoute('/_private/internal/user-management')({
  component: RouteComponent,
})

function RouteComponent() {
  return <InternalUserManagementPage />
}
