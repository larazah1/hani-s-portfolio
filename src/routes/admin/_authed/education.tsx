import { createFileRoute } from "@tanstack/react-router";
import { CollectionCrudScreen, type CrudRow } from "@/components/admin/CollectionCrudScreen";
import { educationCrud } from "@/server-fns/collections/education";

export const Route = createFileRoute("/admin/_authed/education")({
  component: EducationPage,
});

function EducationPage() {
  return (
    <CollectionCrudScreen
      queryKey="education"
      title="التعليم"
      description="المؤهلات الأكاديمية التي تظهر في صفحة نبذة عني."
      fields={[
        { name: "degree", label: "الدرجة العلمية (مثال: دكتوراه)" },
        { name: "degreeAr", label: "الدرجة العلمية (بالعربية)" },
        { name: "field", label: "التخصص" },
        { name: "fieldAr", label: "التخصص (بالعربية)" },
        { name: "university", label: "الجامعة" },
        { name: "universityAr", label: "الجامعة (بالعربية)" },
        { name: "location", label: "الموقع" },
        { name: "locationAr", label: "الموقع (بالعربية)" },
        { name: "year", label: "السنة" },
        { name: "description", label: "الوصف", type: "textarea", required: false },
        {
          name: "descriptionAr",
          label: "الوصف (بالعربية)",
          type: "textarea",
          required: false,
        },
      ]}
      api={educationCrud}
      getRowTitle={(row: CrudRow) => `${row["degree"]} · ${row["field"]}`}
      getRowSubtitle={(row: CrudRow) => `${row["university"]} — ${row["year"]}`}
    />
  );
}
