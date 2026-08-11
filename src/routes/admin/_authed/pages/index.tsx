import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { listPages } from "@/server-fns/pages";

export const Route = createFileRoute("/admin/_authed/pages/")({
  component: PagesListPage,
});

function PagesListPage() {
  const { data, isLoading } = useQuery({ queryKey: ["pages"], queryFn: () => listPages() });
  const rows = data ?? [];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">هيكل الموقع</p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold">
            الصفحات
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            كل صفحة مبنية من أقسام يمكنك إضافتها أو حذفها أو إعادة ترتيبها.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/pages/new">
            <Plus />
            إضافة صفحة
          </Link>
        </Button>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-border bg-card">
        {isLoading ? (
          <p className="p-6 text-sm text-muted-foreground">جارٍ التحميل…</p>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((page) => (
              <li key={page.id} className="flex items-center gap-3 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{page.title}</p>
                    <Badge variant={page.status === "published" ? "default" : "secondary"}>
                      {page.status === "published" ? "منشورة" : "مسودة"}
                    </Badge>
                    {page.isCore && <Badge variant="outline">أساسية</Badge>}
                    {!page.showInNav && <Badge variant="outline">مخفية من القائمة</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground" dir="ltr">
                    {page.path}
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin/pages/$pageId" params={{ pageId: page.id }}>
                    تعديل الأقسام
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
