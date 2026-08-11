import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { getCurrentAdmin } from "@/server-fns/auth";

export const Route = createFileRoute("/admin/_authed")({
  beforeLoad: async () => {
    // A server-function round trip, not a router-context read: request
    // middleware's resolved admin lives on the server-function/request
    // context, which doesn't automatically flow into the router's
    // beforeLoad context — so the guard crosses that boundary explicitly
    // here rather than assuming it's already available.
    const admin = await getCurrentAdmin();
    if (!admin) {
      throw redirect({ to: "/admin/login" });
    }
    return { admin };
  },
  component: AuthedLayout,
});

function AuthedLayout() {
  const { admin } = Route.useRouteContext();
  return (
    <AdminShell admin={admin}>
      <Outlet />
    </AdminShell>
  );
}
