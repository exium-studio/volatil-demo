import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/admin/user-management')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/admin/user-management"!</div>
}
