import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ChevronDown, ChevronUp, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { SectionEditor, type SectionEditorValues } from "@/components/admin/SectionEditor";
import { SECTION_TYPES, SECTION_TYPE_LABELS, type SectionType } from "@/lib/section-types";
import {
  addSection,
  deleteSection,
  getPageForEdit,
  reorderSections,
  updatePage,
  updateSection,
} from "@/server-fns/pages";

export const Route = createFileRoute("/admin/_authed/pages/$pageId")({
  component: PageSectionBuilder,
});

type SectionRow = {
  id: string;
  type: SectionType;
  eyebrow: string | null;
  eyebrowAr: string | null;
  title: string | null;
  titleAr: string | null;
  config: Record<string, unknown>;
  visible: boolean;
  sortOrder: number;
};

function PageSectionBuilder() {
  const { pageId } = Route.useParams();
  const queryClient = useQueryClient();
  const queryKey = ["page-edit", pageId];
  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => getPageForEdit({ data: { id: pageId } }),
  });

  const [addType, setAddType] = useState<SectionType>("rich-text");
  const [editingSection, setEditingSection] = useState<SectionRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SectionRow | null>(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const updatePageMutation = useMutation({
    mutationFn: (fields: { showInNav?: boolean; status?: "draft" | "published" }) =>
      updatePage({ data: { id: pageId, ...fields } }),
    onSuccess: invalidate,
  });
  const addSectionMutation = useMutation({
    mutationFn: (type: SectionType) => addSection({ data: { pageId, type } }),
    onSuccess: invalidate,
  });
  const updateSectionMutation = useMutation({
    mutationFn: (values: SectionEditorValues & { id: string }) => updateSection({ data: values }),
    onSuccess: () => {
      invalidate();
      setEditingSection(null);
    },
  });
  const deleteSectionMutation = useMutation({
    mutationFn: (id: string) => deleteSection({ data: { id } }),
    onSuccess: () => {
      invalidate();
      setDeleteTarget(null);
    },
  });
  const toggleVisibleMutation = useMutation({
    mutationFn: (values: { id: string; visible: boolean }) => updateSection({ data: values }),
    onSuccess: invalidate,
  });
  const reorderMutation = useMutation({
    mutationFn: (orderedIds: string[]) => reorderSections({ data: { pageId, orderedIds } }),
    onSuccess: invalidate,
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (!data) return <p className="text-sm text-muted-foreground">Page not found.</p>;

  const { page, sections } = data;
  const typedSections = sections as SectionRow[];

  function moveSection(index: number, direction: -1 | 1) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= typedSections.length) return;
    const reordered = typedSections.slice();
    const moved = reordered.splice(index, 1)[0];
    if (!moved) return;
    reordered.splice(newIndex, 0, moved);
    reorderMutation.mutate(reordered.map((s) => s.id));
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Pages</p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold">
            {page.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{page.path}</p>
        </div>
        <div className="flex items-center gap-6 rounded-md border border-border bg-card px-4 py-3">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Switch
              checked={page.showInNav}
              onCheckedChange={(v) => updatePageMutation.mutate({ showInNav: v })}
            />
            In navigation
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <Switch
              checked={page.status === "published"}
              onCheckedChange={(v) =>
                updatePageMutation.mutate({ status: v ? "published" : "draft" })
              }
            />
            Published
          </label>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3">
        <Select value={addType} onValueChange={(v) => setAddType(v as SectionType)}>
          <SelectTrigger className="w-80">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SECTION_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {SECTION_TYPE_LABELS[t]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={() => addSectionMutation.mutate(addType)}
          disabled={addSectionMutation.isPending}
        >
          <Plus />
          Add Section
        </Button>
      </div>

      <div className="mt-6 space-y-3">
        {typedSections.length === 0 ? (
          <p className="rounded-md border border-dashed border-border px-5 py-8 text-sm text-muted-foreground">
            No sections yet — add one above.
          </p>
        ) : (
          typedSections.map((section, index) => (
            <div
              key={section.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3"
            >
              <div className="flex flex-col">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveSection(index, -1)}
                  aria-label="Move up"
                  className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={index === typedSections.length - 1}
                  onClick={() => moveSection(index, 1)}
                  aria-label="Move down"
                  className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{SECTION_TYPE_LABELS[section.type]}</p>
                  {!section.visible && <Badge variant="outline">Hidden</Badge>}
                </div>
                {(section.title || section.eyebrow) && (
                  <p className="truncate text-xs text-muted-foreground">
                    {section.eyebrow ? `${section.eyebrow} — ` : ""}
                    {section.title}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    toggleVisibleMutation.mutate({ id: section.id, visible: !section.visible })
                  }
                  aria-label={section.visible ? "Hide section" : "Show section"}
                >
                  {section.visible ? (
                    <Eye className="h-3.5 w-3.5" />
                  ) : (
                    <EyeOff className="h-3.5 w-3.5" />
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setEditingSection(section)}>
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => setDeleteTarget(section)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={!!editingSection} onOpenChange={(open) => !open && setEditingSection(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit {editingSection ? SECTION_TYPE_LABELS[editingSection.type] : ""} Section
            </DialogTitle>
          </DialogHeader>
          {editingSection && (
            <SectionEditorPanel
              section={editingSection}
              isSaving={updateSectionMutation.isPending}
              onSave={(values) =>
                updateSectionMutation.mutate({ id: editingSection.id, ...values })
              }
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this section?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes it from the page. The underlying content (publications, etc.) is not
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && deleteSectionMutation.mutate(deleteTarget.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function SectionEditorPanel({
  section,
  isSaving,
  onSave,
}: {
  section: SectionRow;
  isSaving: boolean;
  onSave: (values: SectionEditorValues) => void;
}) {
  const [values, setValues] = useState<SectionEditorValues>({
    eyebrow: section.eyebrow ?? "",
    eyebrowAr: section.eyebrowAr ?? "",
    title: section.title ?? "",
    titleAr: section.titleAr ?? "",
    config: section.config ?? {},
  });

  return (
    <div className="min-w-0 space-y-6">
      <SectionEditor type={section.type} values={values} onChange={setValues} />
      <Button onClick={() => onSave(values)} disabled={isSaving}>
        {isSaving ? "Saving…" : "Save Section"}
      </Button>
    </div>
  );
}
