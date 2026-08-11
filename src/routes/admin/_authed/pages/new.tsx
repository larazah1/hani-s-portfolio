import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { createPage } from "@/server-fns/pages";

export const Route = createFileRoute("/admin/_authed/pages/new")({
  component: NewPagePage,
});

function NewPagePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    path: "",
    title: "",
    titleAr: "",
    navLabel: "",
    navLabelAr: "",
    showInNav: true,
  });

  const mutation = useMutation({
    mutationFn: () =>
      createPage({
        data: {
          path: form.path,
          title: form.title,
          titleAr: form.titleAr,
          navLabel: form.navLabel || undefined,
          navLabelAr: form.navLabelAr || undefined,
          showInNav: form.showInNav,
        },
      }),
    onSuccess: (row) => {
      void queryClient.invalidateQueries({ queryKey: ["pages"] });
      void router.navigate({ to: "/admin/pages/$pageId", params: { pageId: row.id } });
    },
    onError: (e: Error) => setError(e.message || "Something went wrong."),
  });

  return (
    <div className="max-w-xl">
      <p className="eyebrow">Site Structure</p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold">
        Add Page
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Starts empty — add sections once it&rsquo;s created. New pages start as a draft.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          mutation.mutate();
        }}
        className="mt-8 space-y-4"
      >
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Path (e.g. /research)</label>
          <Input
            value={form.path}
            onChange={(e) => setForm((f) => ({ ...f, path: e.target.value }))}
            placeholder="/research"
            required
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Title (Arabic)</label>
            <Input
              value={form.titleAr}
              onChange={(e) => setForm((f) => ({ ...f, titleAr: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Nav label (optional)</label>
            <Input
              value={form.navLabel}
              onChange={(e) => setForm((f) => ({ ...f, navLabel: e.target.value }))}
              placeholder="Defaults to Title"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Nav label (Arabic, optional)</label>
            <Input
              value={form.navLabelAr}
              onChange={(e) => setForm((f) => ({ ...f, navLabelAr: e.target.value }))}
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm font-medium">
          <Switch
            checked={form.showInNav}
            onCheckedChange={(v) => setForm((f) => ({ ...f, showInNav: v }))}
          />
          Show in navigation
        </label>

        {error && (
          <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Creating…" : "Create Page"}
        </Button>
      </form>
    </div>
  );
}
