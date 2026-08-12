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
  cvUrl: string;
};

const FIELD_GROUPS: { heading: string; fields: { name: keyof FormState; label: string }[] }[] = [
  {
    heading: "الهوية",
    fields: [
      { name: "name", label: "الاسم" },
      { name: "nameAr", label: "الاسم (بالعربية)" },
      { name: "credentials", label: "المؤهلات (مثال: دكتوراه)" },
      { name: "credentialsAr", label: "المؤهلات (بالعربية)" },
    ],
  },
  {
    heading: "الصفحة الرئيسية",
    fields: [
      { name: "title", label: "المسمى الوظيفي" },
      { name: "titleAr", label: "المسمى الوظيفي (بالعربية)" },
      { name: "tagline", label: "وصف مختصر" },
      { name: "taglineAr", label: "وصف مختصر (بالعربية)" },
      { name: "location", label: "الموقع" },
      { name: "locationAr", label: "الموقع (بالعربية)" },
    ],
  },
  {
    heading: "التواصل",
    fields: [
      { name: "email", label: "البريد الإلكتروني" },
      { name: "phone", label: "الهاتف" },
    ],
  },
  {
    heading: "أزرار الصفحة الرئيسية",
    fields: [
      { name: "primaryCtaLabel", label: "نص الزر الأساسي" },
      { name: "primaryCtaLabelAr", label: "نص الزر الأساسي (بالعربية)" },
      { name: "primaryCtaTo", label: "رابط الزر الأساسي (مثال: /publications)" },
      { name: "secondaryCtaLabel", label: "نص الزر الثانوي" },
      { name: "secondaryCtaLabelAr", label: "نص الزر الثانوي (بالعربية)" },
      { name: "secondaryCtaTo", label: "رابط الزر الثانوي (مثال: /contact)" },
    ],
  },
  {
    heading: "السيرة الذاتية",
    fields: [{ name: "cvUrl", label: "رابط السيرة الذاتية (PDF)" }],
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
        cvUrl: data.cvUrl ?? "",
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
    return <p className="text-sm text-muted-foreground">جارٍ التحميل…</p>;
  }

  function set<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  return (
    <div className="max-w-3xl">
      <p className="eyebrow">الملف الشخصي والصفحة الرئيسية</p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold">
        الملف الشخصي والصفحة الرئيسية
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        يغذّي هذا القسم الترويسة وواجهة الصفحة الرئيسية وبيانات التواصل الظاهرة في أنحاء الموقع.
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
            {saveMutation.isPending ? "جارٍ الحفظ…" : "حفظ التغييرات"}
          </Button>
          {saved && <span className="text-sm text-muted-foreground">تم الحفظ.</span>}
        </div>
      </form>
    </div>
  );
}
