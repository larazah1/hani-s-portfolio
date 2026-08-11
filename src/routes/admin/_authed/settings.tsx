import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getSiteSettings, updateSiteSettings } from "@/server-fns/site-settings";

export const Route = createFileRoute("/admin/_authed/settings")({
  component: SettingsPage,
});

type FormState = {
  siteName: string;
  siteNameAr: string;
  siteDescription: string;
  siteDescriptionAr: string;
  logoUrl: string;
  faviconUrl: string;
  defaultMetaTitle: string;
  defaultMetaTitleAr: string;
  defaultMetaDescription: string;
  defaultMetaDescriptionAr: string;
  ogImageUrl: string;
  footerDescription: string;
  footerDescriptionAr: string;
  copyrightText: string;
  copyrightTextAr: string;
};

function SettingsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["site-settings"],
    queryFn: () => getSiteSettings(),
  });
  const [form, setForm] = useState<FormState | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data && !form) {
      setForm({
        siteName: data.siteName,
        siteNameAr: data.siteNameAr,
        siteDescription: data.siteDescription,
        siteDescriptionAr: data.siteDescriptionAr,
        logoUrl: data.logoUrl ?? "",
        faviconUrl: data.faviconUrl ?? "",
        defaultMetaTitle: data.defaultMetaTitle,
        defaultMetaTitleAr: data.defaultMetaTitleAr,
        defaultMetaDescription: data.defaultMetaDescription,
        defaultMetaDescriptionAr: data.defaultMetaDescriptionAr,
        ogImageUrl: data.ogImageUrl ?? "",
        footerDescription: data.footerDescription,
        footerDescriptionAr: data.footerDescriptionAr,
        copyrightText: data.copyrightText,
        copyrightTextAr: data.copyrightTextAr,
      });
    }
  }, [data, form]);

  const saveMutation = useMutation({
    mutationFn: (values: FormState) => updateSiteSettings({ data: values }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
  });

  if (isLoading || !form) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  function set<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  return (
    <div className="max-w-3xl">
      <p className="eyebrow">Website Settings</p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold">
        Website Settings
      </h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (form) saveMutation.mutate(form);
        }}
        className="mt-8 space-y-10"
      >
        <div>
          <h2 className="text-sm font-semibold text-foreground">General</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field
              label="Website Name"
              value={form.siteName}
              onChange={(v) => set("siteName", v)}
            />
            <Field
              label="Website Name (Arabic)"
              value={form.siteNameAr}
              onChange={(v) => set("siteNameAr", v)}
            />
            <Field label="Logo URL" value={form.logoUrl} onChange={(v) => set("logoUrl", v)} full />
            <Field
              label="Favicon URL"
              value={form.faviconUrl}
              onChange={(v) => set("faviconUrl", v)}
              full
            />
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-medium">Website Description</label>
              <Textarea
                rows={2}
                value={form.siteDescription}
                onChange={(e) => set("siteDescription", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-medium">Website Description (Arabic)</label>
              <Textarea
                rows={2}
                value={form.siteDescriptionAr}
                onChange={(e) => set("siteDescriptionAr", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-foreground">SEO / Metadata</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field
              label="Default Page Title"
              value={form.defaultMetaTitle}
              onChange={(v) => set("defaultMetaTitle", v)}
            />
            <Field
              label="Default Page Title (Arabic)"
              value={form.defaultMetaTitleAr}
              onChange={(v) => set("defaultMetaTitleAr", v)}
            />
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-medium">Default Meta Description</label>
              <Textarea
                rows={2}
                value={form.defaultMetaDescription}
                onChange={(e) => set("defaultMetaDescription", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-medium">Default Meta Description (Arabic)</label>
              <Textarea
                rows={2}
                value={form.defaultMetaDescriptionAr}
                onChange={(e) => set("defaultMetaDescriptionAr", e.target.value)}
              />
            </div>
            <Field
              label="Open Graph Image URL"
              value={form.ogImageUrl}
              onChange={(v) => set("ogImageUrl", v)}
              full
            />
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-foreground">Footer</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field
              label="Footer Description"
              value={form.footerDescription}
              onChange={(v) => set("footerDescription", v)}
            />
            <Field
              label="Footer Description (Arabic)"
              value={form.footerDescriptionAr}
              onChange={(v) => set("footerDescriptionAr", v)}
            />
            <Field
              label="Copyright Text"
              value={form.copyrightText}
              onChange={(v) => set("copyrightText", v)}
            />
            <Field
              label="Copyright Text (Arabic)"
              value={form.copyrightTextAr}
              onChange={(v) => set("copyrightTextAr", v)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? "Saving…" : "Save Changes"}
          </Button>
          {saved && <span className="text-sm text-muted-foreground">Saved.</span>}
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  full,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  full?: boolean;
}) {
  return (
    <div className={`space-y-1.5 ${full ? "sm:col-span-2" : ""}`}>
      <label className="text-sm font-medium">{label}</label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
