import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/news/$slug")({
  beforeLoad: () => {
    throw redirect({ to: "/news" });
  },
});
