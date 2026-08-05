import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/admin/notification")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_app/admin/notification"!</div>;
}
