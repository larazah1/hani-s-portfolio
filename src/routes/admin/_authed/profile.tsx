import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProfile, updateProfile } from "@/server-fns/profile";

export const Route = createFileRoute("/admin/_authed/profile")({
  component: ProfilePage,
});

type FormState = {
  name: string;
  nameAr: string;
  credentials: string;
  credentialsAr: string;
  title: string;
  titleAr: string;
  tagline: string;
  taglineAr: string;
  location: string;
  locationAr: string;
  email: string;
  phone: string;
  primaryCtaLabel: string;
  primaryCtaLabelAr: string;
  primaryCtaTo: string;
  secondaryCtaLabel: string;
  secondaryCtaLabelAr: string;
  secondaryCtaTo: string;
};

const FIELD_GROUPS: { heading: string; fields: { name: keyof FormState; label: string }[] }[] = [
  {
    heading: "Identity",
    fields: [
      { name: "name", label: "Name" },
      { name: "nameAr", label: "Name (Arabic)" },
      { name: "credentials", label: "Credentials (e.g. PhD)" },
      { name: "credentialsAr", label: "Credentials (Arabic)" },
    ],
  },
  {
    heading: "Hero",
    fields: [
      { name: "title", label: "Professional Title" },
      { name: "titleAr", label: "Professional Title (Arabic)" },
      { name: "tagline", label: "Short Description" },
      { name: "taglineAr", label: "Short Description (Arabic)" },
      { name: "location", label: "Location" },
      { name: "locationAr", label: "Location (Arabic)" },
    ],
  },
  {
    heading: "Contact",
    fields: [
      { name: "email", label: "Email" },
      { name: "phone", label: "Phone" },
    ],
  },
  {
    heading: "Hero Buttons",
    fields: [
      { name: "primaryCtaLabel", label: "Primary Button Text" },
      { name: "primaryCtaLabelAr", label: "Primary Button Text (Arabic)" },
      { name: "primaryCtaTo", label: "Primary Button Link (e.g. /publications)" },
      { name: "secondaryCtaLabel", label: "Secondary Button Text" },
      { name: "secondaryCtaLabelAr", label: "Secondary Button Text (Arabic)" },
      { name: "secondaryCtaTo", label: "Secondary Button Link (e.g. /contact)" },
    ],
  },
];

function ProfilePage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["profile"], queryFn: () => getProfile() });
  const [form, setForm] = useState<FormState | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data && !form) {
      setForm({
        name: data.name,
        nameAr: data.nameAr,
        credentials: data.credentials,
        credentialsAr: data.credentialsAr,
        title: data.title,
        titleAr: data.titleAr,
        tagline: data.tagline,
        taglineAr: data.taglineAr,
        location: data.location,
        locationAr: data.locationAr,
        email: data.email,
        phone: data.phone,
        primaryCtaLabel: data.primaryCtaLabel,
        primaryCtaLabelAr: data.primaryCtaLabelAr,
        primaryCtaTo: data.primaryCtaTo,
        secondaryCtaLabel: data.secondaryCtaLabel,
        secondaryCtaLabelAr: data.secondaryCtaLabelAr,
        secondaryCtaTo: data.secondaryCtaTo,
      });
    }
  }, [data, form]);

  const saveMutation = useMutation({
    mutationFn: (values: FormState) => updateProfile({ data: values }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["profile"] });
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
      <p className="eyebrow">Profile & Hero</p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold">
        Profile & Hero
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Powers the header, homepage hero, and contact details shown across the site.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (form) saveMutation.mutate(form);
        }}
        className="mt-8 space-y-10"
      >
        {FIELD_GROUPS.map((group) => (
          <div key={group.heading}>
            <h2 className="text-sm font-semibold text-foreground">{group.heading}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {group.fields.map((f) => (
                <div key={f.name} className="space-y-1.5">
                  <label className="text-sm font-medium">{f.label}</label>
                  <Input value={form[f.name]} onChange={(e) => set(f.name, e.target.value)} />
                </div>
              ))}
            </div>
          </div>
        ))}

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
