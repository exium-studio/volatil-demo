import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/portal/home")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_app/portal/home"!</div>;
}
