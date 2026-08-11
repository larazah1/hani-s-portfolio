import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export type RecommendationFormValues = {
  name: string;
  position: string;
  organization: string;
  body: string;
  dateLabel: string;
  featured: boolean;
  status: "draft" | "published";
};

export const emptyRecommendationForm: RecommendationFormValues = {
  name: "",
  position: "",
  organization: "",
  body: "",
  dateLabel: "",
  featured: false,
  status: "draft",
};

export function RecommendationForm({
  initial,
  submitLabel,
  onSubmit,
  isSubmitting,
  error,
}: {
  initial: RecommendationFormValues;
  submitLabel: string;
  onSubmit: (values: RecommendationFormValues) => void;
  isSubmitting: boolean;
  error: string | null;
}) {
  const [form, setForm] = useState(initial);

  function set<K extends keyof RecommendationFormValues>(
    key: K,
    value: RecommendationFormValues[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="max-w-2xl space-y-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Person Name</label>
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Position</label>
          <Input value={form.position} onChange={(e) => set("position", e.target.value)} required />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-sm font-medium">Organization</label>
          <Input value={form.organization} onChange={(e) => set("organization", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Date</label>
          <Input value={form.dateLabel} onChange={(e) => set("dateLabel", e.target.value)} />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-sm font-medium">Recommendation Text</label>
          <Textarea
            rows={5}
            value={form.body}
            onChange={(e) => set("body", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-8 rounded-md border border-border bg-card px-4 py-3">
        <label className="flex items-center gap-2 text-sm font-medium">
          <Switch checked={form.featured} onCheckedChange={(v) => set("featured", v)} />
          Featured on homepage
        </label>
        <label className="flex items-center gap-2 text-sm font-medium">
          <Switch
            checked={form.status === "published"}
            onCheckedChange={(v) => set("status", v ? "published" : "draft")}
          />
          Published
        </label>
      </div>

      {error && (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
