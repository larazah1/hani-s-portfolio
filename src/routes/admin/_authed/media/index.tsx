import { createFileRoute, Link } from "@tanstack/react-router";
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
import { deleteMediaItem, duplicateMediaItem, listMedia } from "@/server-fns/media";

export const Route = createFileRoute("/admin/_authed/media/")({
  component: MediaListPage,
});

function MediaListPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["media"], queryFn: () => listMedia() });
  const rows = data ?? [];

  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [deleteTarget, setDeleteTarget] = useState<(typeof rows)[number] | null>(null);

  const types = useMemo(() => ["All", ...Array.from(new Set(rows.map((m) => m.type)))], [rows]);

  const filtered = rows.filter((m) => {
    const matchesQuery = `${m.title} ${m.source}`.toLowerCase().includes(query.toLowerCase());
    const matchesType = type === "All" || m.type === type;
    return matchesQuery && matchesType;
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMediaItem({ data: { id } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["media"] });
      setDeleteTarget(null);
    },
  });
  const duplicateMutation = useMutation({
    mutationFn: (id: string) => duplicateMediaItem({ data: { id } }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["media"] }),
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Interviews & Articles</p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold">
            Interviews & Articles
          </h1>
        </div>
        <Button asChild>
          <Link to="/admin/media/new">
            <Plus />
            Add Interview / Article
          </Link>
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="max-w-xs"
        />
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {types.map((t) => (
              <SelectItem key={t} value={t}>
                {t === "All" ? "All types" : t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-border bg-card">
        {isLoading ? (
          <p className="p-6 text-sm text-muted-foreground">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">Nothing matches.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((m) => {
                const primaryUrl = m.videoUrl ?? m.articleUrl;
                return (
                  <TableRow key={m.id}>
                    <TableCell className="max-w-sm truncate font-medium">{m.title}</TableCell>
                    <TableCell>{m.source}</TableCell>
                    <TableCell>{m.dateLabel}</TableCell>
                    <TableCell>{m.type}</TableCell>
                    <TableCell>
                      <Badge variant={m.status === "published" ? "default" : "secondary"}>
                        {m.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{m.featured ? "Yes" : "—"}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        {primaryUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={primaryUrl} target="_blank" rel="noreferrer noopener">
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </Button>
                        )}
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/admin/media/$mediaId" params={{ mediaId: m.id }}>
                            Edit
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => duplicateMutation.mutate(m.id)}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setDeleteTarget(m)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this item?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.title} — this can&rsquo;t be undone, and it will be removed from any
              homepage carousel it appears in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
