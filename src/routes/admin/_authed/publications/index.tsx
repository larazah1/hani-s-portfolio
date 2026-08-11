import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Copy, ExternalLink, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { publicationTypeAr } from "@/lib/publication-i18n";
import {
  deletePublication,
  duplicatePublication,
  listPublications,
} from "@/server-fns/publications";

export const Route = createFileRoute("/admin/_authed/publications/")({
  component: PublicationsListPage,
});

const STATUS_AR: Record<string, string> = { published: "منشور", draft: "مسودة" };

function PublicationsListPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["publications"],
    queryFn: () => listPublications(),
  });
  const rows = data ?? [];

  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [deleteTarget, setDeleteTarget] = useState<(typeof rows)[number] | null>(null);

  const types = useMemo(() => ["All", ...Array.from(new Set(rows.map((p) => p.type)))], [rows]);

  const filtered = rows.filter((p) => {
    const matchesQuery = `${p.title} ${p.authors} ${p.journal}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesType = type === "All" || p.type === type;
    return matchesQuery && matchesType;
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePublication({ data: { id } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["publications"] });
      setDeleteTarget(null);
    },
  });
  const duplicateMutation = useMutation({
    mutationFn: (id: string) => duplicatePublication({ data: { id } }),
    onSuccess: (row) => {
      void queryClient.invalidateQueries({ queryKey: ["publications"] });
      void router.navigate({
        to: "/admin/publications/$publicationId",
        params: { publicationId: row["id"] as string },
      });
    },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">المنشورات</p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold">
            المنشورات
          </h1>
        </div>
        <Button asChild>
          <Link to="/admin/publications/new">
            <Plus />
            إضافة منشور
          </Link>
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="البحث في المنشورات"
          className="max-w-xs"
        />
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {types.map((t) => (
              <SelectItem key={t} value={t}>
                {t === "All" ? "كل الأنواع" : (publicationTypeAr[t] ?? t)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-border bg-card">
        {isLoading ? (
          <p className="p-6 text-sm text-muted-foreground">جارٍ التحميل…</p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">لا توجد منشورات مطابقة.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>العنوان</TableHead>
                <TableHead>السنة</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>مميز</TableHead>
                <TableHead className="text-end">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="max-w-sm">
                    <p className="truncate font-medium">{p.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{p.journal}</p>
                  </TableCell>
                  <TableCell>{p.year}</TableCell>
                  <TableCell>{publicationTypeAr[p.type] ?? p.type}</TableCell>
                  <TableCell>
                    <Badge variant={p.status === "published" ? "default" : "secondary"}>
                      {STATUS_AR[p.status] ?? p.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{p.featured ? "نعم" : "—"}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      {p.url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={p.url} target="_blank" rel="noreferrer noopener">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                      )}
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          to="/admin/publications/$publicationId"
                          params={{ publicationId: p.id }}
                        >
                          تعديل
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => duplicateMutation.mutate(p.id)}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setDeleteTarget(p)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل تريد حذف هذا المنشور؟</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.title} — لا يمكن التراجع عن هذا الإجراء، وسيُحذف المنشور من أي عرض
              شرائح في الصفحة الرئيسية يظهر فيه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
