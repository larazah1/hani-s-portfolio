import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  BarChart3,
  BookMarked,
  Eye,
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
        { label: "المنشورات", value: data.counts.publications, icon: BookMarked },
        { label: "المقابلات والمقالات", value: data.counts.media, icon: Newspaper },
        { label: "التوصيات", value: data.counts.recommendations, icon: Quote },
        { label: "الصفحات", value: data.counts.pages, icon: FileText },
        { label: "رسائل غير مقروءة", value: data.counts.unreadMessages, icon: Inbox },
        { label: "المسؤولون النشطون", value: data.counts.activeAdmins, icon: ShieldCheck },
        { label: "إجمالي المشاهدات", value: data.counts.totalViews, icon: Eye },
      ]
    : [];

  return (
    <div>
      <p className="eyebrow">لوحة التحكم</p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold">
        مرحبًا بعودتك
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">تم تسجيل الدخول باسم {admin.email}</p>

      {isLoading ? (
        <p className="mt-8 text-sm text-muted-foreground">جارٍ التحميل…</p>
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

          {data?.homePageId && (
            <div className="mt-8">
              <p className="text-sm font-medium">إجراءات سريعة</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <Link
                  to="/admin/pages/$pageId"
                  params={{ pageId: data.homePageId }}
                  className="group flex items-center gap-4 rounded-lg border border-border bg-card p-5 transition-colors hover:border-accent-foreground/40 hover:bg-secondary/40"
                >
                  <LayoutTemplate className="h-6 w-6 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">تعديل أقسام الصفحة الرئيسية</p>
                    <p className="text-xs text-muted-foreground">
                      أضف الأقسام في الصفحة الرئيسية أو احذفها أو أعد ترتيبها.
                    </p>
                  </div>
                  <ArrowLeft className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-0.5" />
                </Link>
              </div>
            </div>
          )}

          <div className="mt-8 rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <p className="text-sm font-medium">الصفحات الأكثر مشاهدة</p>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </div>
            {data && data.topPages.length > 0 ? (
              <ul className="divide-y divide-border">
                {data.topPages.map((p) => (
                  <li key={p.path} className="flex items-center justify-between px-5 py-3 text-sm">
                    <span className="font-mono text-xs text-muted-foreground" dir="ltr">
                      {p.path}
                    </span>
                    <span className="font-medium">{p.count}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-5 text-sm text-muted-foreground">لا توجد مشاهدات مسجَّلة بعد.</p>
            )}
          </div>

          <div className="mt-8 rounded-lg border border-border bg-card p-5">
            <p className="text-sm font-medium">روابط سريعة</p>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              <Link
                className="underline underline-offset-4 hover:text-accent-foreground"
                to="/admin/messages"
              >
                رسائل التواصل
              </Link>
              <span className="text-muted-foreground">·</span>
              <Link
                className="underline underline-offset-4 hover:text-accent-foreground"
                to="/admin/pages"
              >
                الصفحات
              </Link>
              <span className="text-muted-foreground">·</span>
              <Link
                className="underline underline-offset-4 hover:text-accent-foreground"
                to="/admin/admins"
              >
                المسؤولون
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
