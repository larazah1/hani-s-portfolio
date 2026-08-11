import { useQuery } from "@tanstack/react-query";
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
import { ItemPicker } from "@/components/admin/ItemPicker";
import type { SectionType } from "@/lib/section-types";
import { listPublications } from "@/server-fns/publications";
import { listMedia } from "@/server-fns/media";
import { listRecommendations } from "@/server-fns/recommendations";

export type SectionEditorValues = {
  eyebrow: string;
  eyebrowAr: string;
  title: string;
  titleAr: string;
  config: Record<string, unknown>;
};

const LIST_BLOCK_COLLECTIONS = [
  { value: "researchSpecialties", label: "التخصصات البحثية" },
  { value: "activities", label: "الأنشطة العلمية" },
  { value: "languagesList", label: "اللغات" },
  { value: "interests", label: "الاهتمامات" },
];

export function SectionEditor({
  type,
  values,
  onChange,
}: {
  type: SectionType;
  values: SectionEditorValues;
  onChange: (values: SectionEditorValues) => void;
}) {
  function setField<K extends keyof SectionEditorValues>(key: K, value: SectionEditorValues[K]) {
    onChange({ ...values, [key]: value });
  }
  function setConfig(key: string, value: unknown) {
    onChange({ ...values, config: { ...values.config, [key]: value } });
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">تجاوز النص التمهيدي</label>
          <Input
            value={values.eyebrow}
            onChange={(e) => setField("eyebrow", e.target.value)}
            placeholder="اتركه فارغًا لاستخدام القيمة الافتراضية"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">تجاوز النص التمهيدي (بالعربية)</label>
          <Input value={values.eyebrowAr} onChange={(e) => setField("eyebrowAr", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">تجاوز العنوان</label>
          <Input
            value={values.title}
            onChange={(e) => setField("title", e.target.value)}
            placeholder="اتركه فارغًا لاستخدام القيمة الافتراضية"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">تجاوز العنوان (بالعربية)</label>
          <Input value={values.titleAr} onChange={(e) => setField("titleAr", e.target.value)} />
        </div>
      </div>

      <TypeSpecificConfig type={type} config={values.config} setConfig={setConfig} />
    </div>
  );
}

function TypeSpecificConfig({
  type,
  config,
  setConfig,
}: {
  type: SectionType;
  config: Record<string, unknown>;
  setConfig: (key: string, value: unknown) => void;
}) {
  if (type === "career-timeline") {
    return (
      <label className="flex items-center gap-2 text-sm font-medium">
        <Switch
          checked={config["showCollaborations"] !== false}
          onCheckedChange={(v) => setConfig("showCollaborations", v)}
        />
        إظهار إشارة التعاونات البحثية
      </label>
    );
  }

  if (type === "list-block") {
    const collection = (config["collection"] as string) ?? "researchSpecialties";
    return (
      <div className="space-y-1.5">
        <label className="text-sm font-medium">أي قائمة؟</label>
        <Select value={collection} onValueChange={(v) => setConfig("collection", v)}>
          <SelectTrigger className="w-72">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LIST_BLOCK_COLLECTIONS.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (type === "summary" || type === "rich-text") {
    const contentEn = Array.isArray(config["contentEn"]) ? (config["contentEn"] as string[]) : [];
    return (
      <div className="space-y-1.5">
        <label className="text-sm font-medium">الفقرات (الإنجليزية) — فقرة واحدة في كل سطر</label>
        <Textarea
          rows={8}
          value={contentEn.join("\n")}
          onChange={(e) =>
            setConfig(
              "contentEn",
              e.target.value.split("\n").filter((line) => line.trim() !== ""),
            )
          }
        />
        <p className="text-xs text-muted-foreground">
          تظهر محاذاة لليسار في كلتا اللغتين، بنفس أسلوب بقية النصوص الطويلة في هذا الموقع.
        </p>
      </div>
    );
  }

  if (type === "publications-carousel") {
    return <PublicationsPicker config={config} setConfig={setConfig} />;
  }
  if (type === "media-carousel") {
    return <MediaPicker config={config} setConfig={setConfig} />;
  }
  if (type === "recommendations-grid") {
    return <RecommendationsPicker config={config} setConfig={setConfig} />;
  }

  return (
    <p className="text-sm text-muted-foreground">
      هذا النوع من الأقسام لا يحتوي على إعدادات إضافية — يعرض دائمًا القائمة الكاملة.
    </p>
  );
}

function PublicationsPicker({
  config,
  setConfig,
}: {
  config: Record<string, unknown>;
  setConfig: (key: string, value: unknown) => void;
}) {
  const { data } = useQuery({ queryKey: ["publications"], queryFn: () => listPublications() });
  const items = (data ?? []).map((p) => ({
    id: p.id,
    label: p.title,
    sublabel: `${p.year} · ${p.journal}`,
  }));
  const itemIds = Array.isArray(config["itemIds"]) ? (config["itemIds"] as string[]) : [];
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">المنشورات في عرض الشرائح هذا</label>
      <ItemPicker
        allItems={items}
        selectedIds={itemIds}
        onChange={(ids) => setConfig("itemIds", ids)}
        emptyStateHint="لم يتم اختيار شيء — سيتم عرض المنشورات المميزة افتراضيًا."
      />
    </div>
  );
}

function MediaPicker({
  config,
  setConfig,
}: {
  config: Record<string, unknown>;
  setConfig: (key: string, value: unknown) => void;
}) {
  const { data } = useQuery({ queryKey: ["media"], queryFn: () => listMedia() });
  const items = (data ?? []).map((m) => ({ id: m.id, label: m.title, sublabel: m.source }));
  const itemIds = Array.isArray(config["itemIds"]) ? (config["itemIds"] as string[]) : [];
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">العناصر في عرض الشرائح هذا</label>
      <ItemPicker
        allItems={items}
        selectedIds={itemIds}
        onChange={(ids) => setConfig("itemIds", ids)}
        emptyStateHint="لم يتم اختيار شيء — سيتم عرض العناصر المميزة افتراضيًا."
      />
    </div>
  );
}

function RecommendationsPicker({
  config,
  setConfig,
}: {
  config: Record<string, unknown>;
  setConfig: (key: string, value: unknown) => void;
}) {
  const { data } = useQuery({
    queryKey: ["recommendations"],
    queryFn: () => listRecommendations(),
  });
  const items = (data ?? []).map((r) => ({ id: r.id, label: r.name, sublabel: r.position }));
  const itemIds = Array.isArray(config["itemIds"]) ? (config["itemIds"] as string[]) : [];
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">التوصيات المعروضة</label>
      <ItemPicker
        allItems={items}
        selectedIds={itemIds}
        onChange={(ids) => setConfig("itemIds", ids)}
        emptyStateHint="لم يتم اختيار شيء — سيتم عرض التوصيات المميزة افتراضيًا."
      />
    </div>
  );
}
