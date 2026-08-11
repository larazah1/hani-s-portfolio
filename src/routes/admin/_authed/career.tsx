import { createFileRoute } from "@tanstack/react-router";
import { CollectionCrudScreen, type CrudRow } from "@/components/admin/CollectionCrudScreen";
import { careerCrud } from "@/server-fns/collections/career";
import { collaborationsCrud } from "@/server-fns/collections/collaborations";

export const Route = createFileRoute("/admin/_authed/career")({
  component: CareerPage,
});

const careerFields = [
  { name: "position", label: "المنصب" },
  { name: "positionAr", label: "المنصب (بالعربية)" },
  { name: "organization", label: "الجهة" },
  { name: "organizationAr", label: "الجهة (بالعربية)" },
  { name: "startLabel", label: "البداية (مثال: يناير 2020)" },
  { name: "endLabel", label: "النهاية (مثال: حتى الآن)" },
  { name: "description", label: "الوصف", type: "textarea" as const, required: false },
  {
    name: "descriptionAr",
    label: "الوصف (بالعربية)",
    type: "textarea" as const,
    required: false,
  },
];

function CareerPage() {
  return (
    <div className="space-y-14">
      <CollectionCrudScreen
        queryKey="career-entries"
        title="أبرز المسيرة المهنية"
        description="المناصب التي تظهر في الجدول الزمني بالصفحة الرئيسية وقائمة الخبرات في صفحة نبذة عني."
        fields={careerFields}
        api={careerCrud}
        getRowTitle={(row: CrudRow) => String(row["position"])}
        getRowSubtitle={(row: CrudRow) =>
          `${row["organization"]} · ${row["startLabel"]} — ${row["endLabel"]}`
        }
      />

      <CollectionCrudScreen
        queryKey="collaborations"
        title="التعاونات البحثية"
        description="تظهر كإشارة أسفل الجدول الزمني للمسيرة المهنية في الصفحة الرئيسية."
        fields={careerFields}
        api={collaborationsCrud}
        getRowTitle={(row: CrudRow) => String(row["position"])}
        getRowSubtitle={(row: CrudRow) =>
          `${row["organization"]} · ${row["startLabel"]} — ${row["endLabel"]}`
        }
      />
    </div>
  );
}
