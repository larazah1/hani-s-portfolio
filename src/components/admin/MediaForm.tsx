import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MEDIA_TYPES = ["Interview", "Article", "Video", "News Feature", "Other"] as const;

export type MediaFormValues = {
  title: string;
  titleAr: string;
  source: string;
  dateLabel: string;
  type: (typeof MEDIA_TYPES)[number];
  description: string;
  videoUrl: string;
  articleUrl: string;
  thumbnail: string;
  featured: boolean;
  status: "draft" | "published";
};

export const emptyMediaForm: MediaFormValues = {
  title: "",
  titleAr: "",
  source: "",
  dateLabel: "",
  type: "Article",
  description: "",
  videoUrl: "",
  articleUrl: "",
  thumbnail: "",
  featured: false,
  status: "draft",
};

export function MediaForm({
  initial,
  submitLabel,
  onSubmit,
  isSubmitting,
  error,
}: {
  initial: MediaFormValues;
  submitLabel: string;
  onSubmit: (values: MediaFormValues) => void;
  isSubmitting: boolean;
  error: string | null;
}) {
  const [form, setForm] = useState(initial);

  function set<K extends keyof MediaFormValues>(key: K, value: MediaFormValues[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="max-w-3xl space-y-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-sm font-medium">Title</label>
          <Input value={form.title} onChange={(e) => set("title", e.target.value)} required />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-sm font-medium">Title (Arabic)</label>
          <Input value={form.titleAr} onChange={(e) => set("titleAr", e.target.value)} />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Source / Organization</label>
          <Input value={form.source} onChange={(e) => set("source", e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Date (e.g. Jul 2024 or n.d.)</label>
          <Input
            value={form.dateLabel}
            onChange={(e) => set("dateLabel", e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Type</label>
          <Select
            value={form.type}
            onValueChange={(v) => set("type", v as MediaFormValues["type"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MEDIA_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Thumbnail URL</label>
          <Input value={form.thumbnail} onChange={(e) => set("thumbnail", e.target.value)} />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Video URL (for Watch Video)</label>
          <Input value={form.videoUrl} onChange={(e) => set("videoUrl", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Article URL (for Read Article)</label>
          <Input value={form.articleUrl} onChange={(e) => set("articleUrl", e.target.value)} />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-sm font-medium">Short Description</label>
          <Textarea
            rows={3}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
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
