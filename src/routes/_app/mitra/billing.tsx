import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/mitra/billing")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_app/mitra/billing"!</div>;
}
