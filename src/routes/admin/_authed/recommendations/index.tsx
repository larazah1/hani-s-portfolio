import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  deleteRecommendation,
  listRecommendations,
  reorderRecommendations,
} from "@/server-fns/recommendations";

export const Route = createFileRoute("/admin/_authed/recommendations/")({
  component: RecommendationsListPage,
});

function RecommendationsListPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["recommendations"],
    queryFn: () => listRecommendations(),
  });
  const rows = data ?? [];
  const [deleteTarget, setDeleteTarget] = useState<(typeof rows)[number] | null>(null);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteRecommendation({ data: { id } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["recommendations"] });
      setDeleteTarget(null);
    },
  });
  const reorderMutation = useMutation({
    mutationFn: (orderedIds: string[]) => reorderRecommendations({ data: { orderedIds } }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["recommendations"] }),
  });

  function moveRow(index: number, direction: -1 | 1) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= rows.length) return;
    const reordered = rows.slice();
    const moved = reordered.splice(index, 1)[0];
    if (!moved) return;
    reordered.splice(newIndex, 0, moved);
    reorderMutation.mutate(reordered.map((r) => r.id));
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Recommendations</p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold">
            Recommendations
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real testimonials only — don&rsquo;t add placeholder recommendations.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/recommendations/new">
            <Plus />
            Add Recommendation
          </Link>
        </Button>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-border bg-card">
        {isLoading ? (
          <p className="p-6 text-sm text-muted-foreground">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">No recommendations yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((r, index) => (
              <li key={r.id} className="flex items-start gap-3 px-5 py-4">
                <div className="flex flex-col pt-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveRow(index, -1)}
                    aria-label="Move up"
                    className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    disabled={index === rows.length - 1}
                    onClick={() => moveRow(index, 1)}
                    aria-label="Move down"
                    className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{r.name}</p>
                    <Badge variant={r.status === "published" ? "default" : "secondary"}>
                      {r.status}
                    </Badge>
                    {r.featured && <Badge variant="outline">Featured</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {r.position}
                    {r.organization ? `, ${r.organization}` : ""}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{r.body}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      to="/admin/recommendations/$recommendationId"
                      params={{ recommendationId: r.id }}
                    >
                      Edit
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setDeleteTarget(r)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this recommendation?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.name} — this can&rsquo;t be undone.
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
