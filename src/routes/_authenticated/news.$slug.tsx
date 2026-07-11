import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/news/$slug")({
  beforeLoad: () => {
    throw redirect({ to: "/news" });
  },
});
