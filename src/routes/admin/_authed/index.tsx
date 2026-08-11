import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BarChart3,
  BookMarked,
  Eye,
  FilePlus2,
  FileText,
  Inbox,
  LayoutTemplate,
  Newspaper,
  Quote,
  ShieldCheck,
} from "lucide-react";
import { getDashboardData } from "@/server-fns/dashboard";

export const Route = createFileRoute("/admin/_authed/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { admin } = Route.useRouteContext();
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => getDashboardData(),
  });

  const cards = data
    ? [
        { label: "Publications", value: data.counts.publications, icon: BookMarked },
        { label: "Interviews & Articles", value: data.counts.media, icon: Newspaper },
        { label: "Recommendations", value: data.counts.recommendations, icon: Quote },
        { label: "Pages", value: data.counts.pages, icon: FileText },
        { label: "Unread messages", value: data.counts.unreadMessages, icon: Inbox },
        { label: "Active admins", value: data.counts.activeAdmins, icon: ShieldCheck },
        { label: "Total page views", value: data.counts.totalViews, icon: Eye },
      ]
    : [];

  return (
    <div>
      <p className="eyebrow">Dashboard</p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold">
        Welcome back
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Signed in as {admin.email}</p>

      {isLoading ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading…</p>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {cards.map((card) => (
              <div key={card.label} className="rounded-lg border border-border bg-card p-5">
                <card.icon className="h-4 w-4 text-muted-foreground" />
                <p className="mt-3 text-2xl font-semibold">{card.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{card.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <p className="text-sm font-medium">Quick Actions</p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              {data?.homePageId && (
                <Link
                  to="/admin/pages/$pageId"
                  params={{ pageId: data.homePageId }}
                  className="group flex items-center gap-4 rounded-lg border border-border bg-card p-5 transition-colors hover:border-accent-foreground/40 hover:bg-secondary/40"
                >
                  <LayoutTemplate className="h-6 w-6 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">Edit Homepage Sections</p>
                    <p className="text-xs text-muted-foreground">
                      Add, remove, and reorder sections on the homepage.
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              )}
              <Link
                to="/admin/pages/new"
                className="group flex items-center gap-4 rounded-lg border border-border bg-card p-5 transition-colors hover:border-accent-foreground/40 hover:bg-secondary/40"
              >
                <FilePlus2 className="h-6 w-6 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">Add New Page</p>
                  <p className="text-xs text-muted-foreground">
                    Create a new page and add it to the site navigation.
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          <div className="mt-8 rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <p className="text-sm font-medium">Most Viewed Pages</p>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </div>
            {data && data.topPages.length > 0 ? (
              <ul className="divide-y divide-border">
                {data.topPages.map((p) => (
                  <li key={p.path} className="flex items-center justify-between px-5 py-3 text-sm">
                    <span className="font-mono text-xs text-muted-foreground">{p.path}</span>
                    <span className="font-medium">{p.count}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-5 text-sm text-muted-foreground">No views recorded yet.</p>
            )}
          </div>

          <div className="mt-8 rounded-lg border border-border bg-card p-5">
            <p className="text-sm font-medium">Quick links</p>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              <Link
                className="underline underline-offset-4 hover:text-accent-foreground"
                to="/admin/messages"
              >
                Contact Messages
              </Link>
              <span className="text-muted-foreground">·</span>
              <Link
                className="underline underline-offset-4 hover:text-accent-foreground"
                to="/admin/pages"
              >
                Pages
              </Link>
              <span className="text-muted-foreground">·</span>
              <Link
                className="underline underline-offset-4 hover:text-accent-foreground"
                to="/admin/admins"
              >
                Admins
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
