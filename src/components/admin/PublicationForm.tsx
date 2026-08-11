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

const PUBLICATION_TYPES = [
  "Journal Article",
  "Scientific Book",
  "Conference Paper",
  "Report",
  "Other",
] as const;

export type PublicationFormValues = {
  title: string;
  titleAr: string;
  authors: string;
  journal: string;
  year: string;
  type: (typeof PUBLICATION_TYPES)[number];
  area: string;
  areaAr: string;
  doi: string;
  url: string;
  summary: string;
  featured: boolean;
  status: "draft" | "published";
};

export const emptyPublicationForm: PublicationFormValues = {
  title: "",
  titleAr: "",
  authors: "",
  journal: "",
  year: String(new Date().getFullYear()),
  type: "Journal Article",
  area: "",
  areaAr: "",
  doi: "",
  url: "",
  summary: "",
  featured: false,
  status: "draft",
};

export function PublicationForm({
  initial,
  submitLabel,
  onSubmit,
  isSubmitting,
  error,
}: {
  initial: PublicationFormValues;
  submitLabel: string;
  onSubmit: (values: PublicationFormValues) => void;
  isSubmitting: boolean;
  error: string | null;
}) {
  const [form, setForm] = useState(initial);

  function set<K extends keyof PublicationFormValues>(key: K, value: PublicationFormValues[K]) {
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
          <label className="text-sm font-medium">Publication Title</label>
          <Input value={form.title} onChange={(e) => set("title", e.target.value)} required />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-sm font-medium">Publication Title (Arabic)</label>
          <Input value={form.titleAr} onChange={(e) => set("titleAr", e.target.value)} required />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Authors</label>
          <Input value={form.authors} onChange={(e) => set("authors", e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Journal / Publisher</label>
          <Input value={form.journal} onChange={(e) => set("journal", e.target.value)} required />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Publication Year</label>
          <Input
            type="number"
            value={form.year}
            onChange={(e) => set("year", e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Publication Type</label>
          <Select
            value={form.type}
            onValueChange={(v) => set("type", v as PublicationFormValues["type"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PUBLICATION_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Research Area</label>
          <Input value={form.area} onChange={(e) => set("area", e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Research Area (Arabic)</label>
          <Input value={form.areaAr} onChange={(e) => set("areaAr", e.target.value)} />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">DOI</label>
          <Input value={form.doi} onChange={(e) => set("doi", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Publication URL</label>
          <Input value={form.url} onChange={(e) => set("url", e.target.value)} />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-sm font-medium">Short Summary</label>
          <Textarea
            rows={4}
            value={form.summary}
            onChange={(e) => set("summary", e.target.value)}
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
