import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import type { CollectionCrudApi } from "@/server-fns/collection-helpers";

export type CrudRow = { id: string; sortOrder: number; [key: string]: unknown };

export type CrudFieldConfig = {
  name: string;
  label: string;
  type?: "text" | "textarea";
  required?: boolean;
};

export function CollectionCrudScreen({
  queryKey,
  title,
  description,
  fields,
  api,
  getRowTitle,
  getRowSubtitle,
}: {
  queryKey: string;
  title: string;
  description?: string;
  fields: CrudFieldConfig[];
  api: CollectionCrudApi;
  getRowTitle: (row: CrudRow) => string;
  getRowSubtitle?: (row: CrudRow) => string | undefined;
}) {
  const queryClient = useQueryClient();
  const key = [queryKey, "collection"];
  const { data, isLoading } = useQuery({ queryKey: key, queryFn: () => api.list() });
  const rows = (data ?? []) as CrudRow[];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<CrudRow | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CrudRow | null>(null);

  function openAddDialog() {
    setEditingRow(null);
    const initial: Record<string, string> = {};
    for (const f of fields) initial[f.name] = "";
    setFormValues(initial);
    setFormError(null);
    setDialogOpen(true);
  }

  function openEditDialog(row: CrudRow) {
    setEditingRow(row);
    const initial: Record<string, string> = {};
    for (const f of fields) initial[f.name] = String(row[f.name] ?? "");
    setFormValues(initial);
    setFormError(null);
    setDialogOpen(true);
  }

  const createMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => api.create({ data }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: key });
      setDialogOpen(false);
    },
    onError: (e: Error) => setFormError(e.message || "Something went wrong."),
  });
  const updateMutation = useMutation({
    mutationFn: (data: Record<string, unknown> & { id: string }) => api.update({ data }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: key });
      setDialogOpen(false);
    },
    onError: (e: Error) => setFormError(e.message || "Something went wrong."),
  });
  const removeMutation = useMutation({
    mutationFn: (id: string) => api.remove({ data: { id } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: key });
      setDeleteTarget(null);
    },
  });
  const reorderMutation = useMutation({
    mutationFn: (orderedIds: string[]) => api.reorder({ data: { orderedIds } }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: key }),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const missing = fields.find((f) => f.required !== false && !(formValues[f.name] ?? "").trim());
    if (missing) {
      setFormError(`${missing.label} is required.`);
      return;
    }
    const payload: Record<string, string | undefined> = {};
    for (const f of fields) {
      const value = (formValues[f.name] ?? "").trim();
      payload[f.name] = value === "" ? undefined : value;
    }
    if (editingRow) {
      updateMutation.mutate({ id: editingRow.id, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  function moveRow(index: number, direction: -1 | 1) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= rows.length) return;
    const reordered = rows.slice();
    const moved = reordered.splice(index, 1)[0];
    if (!moved) return;
    reordered.splice(newIndex, 0, moved);
    reorderMutation.mutate(reordered.map((r) => r.id));
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">{title}</p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold">
            {title}
          </h1>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        <Button onClick={openAddDialog}>
          <Plus />
          Add
        </Button>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-border bg-card">
        {isLoading ? (
          <p className="p-6 text-sm text-muted-foreground">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">Nothing here yet. Add the first one.</p>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((row, index) => (
              <li key={row.id} className="flex items-center gap-3 px-5 py-4">
                <div className="flex flex-col">
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
                  <p className="truncate text-sm font-medium">{getRowTitle(row)}</p>
                  {getRowSubtitle?.(row) && (
                    <p className="truncate text-xs text-muted-foreground">{getRowSubtitle(row)}</p>
                  )}
                </div>
                <Button variant="outline" size="sm" onClick={() => openEditDialog(row)}>
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => setDeleteTarget(row)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRow ? `Edit ${title}` : `Add ${title}`}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((f) => (
              <div key={f.name} className="space-y-1.5">
                <label className="text-sm font-medium">{f.label}</label>
                {f.type === "textarea" ? (
                  <Textarea
                    value={formValues[f.name] ?? ""}
                    onChange={(e) => setFormValues((v) => ({ ...v, [f.name]: e.target.value }))}
                    rows={3}
                  />
                ) : (
                  <Input
                    value={formValues[f.name] ?? ""}
                    onChange={(e) => setFormValues((v) => ({ ...v, [f.name]: e.target.value }))}
                  />
                )}
              </div>
            ))}
            {formError && <p className="text-sm text-destructive">{formError}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving…" : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {deleteTarget ? getRowTitle(deleteTarget) : ""}?
            </AlertDialogTitle>
            <AlertDialogDescription>This can&rsquo;t be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && removeMutation.mutate(deleteTarget.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
