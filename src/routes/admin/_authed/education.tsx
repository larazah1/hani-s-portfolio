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
      title="Education"
      description="Academic background shown on the About page."
      fields={[
        { name: "degree", label: "Degree (e.g. PhD)" },
        { name: "degreeAr", label: "Degree (Arabic)" },
        { name: "field", label: "Field of Study" },
        { name: "fieldAr", label: "Field of Study (Arabic)" },
        { name: "university", label: "University" },
        { name: "universityAr", label: "University (Arabic)" },
        { name: "location", label: "Location" },
        { name: "locationAr", label: "Location (Arabic)" },
        { name: "year", label: "Year" },
        { name: "description", label: "Description", type: "textarea", required: false },
        {
          name: "descriptionAr",
          label: "Description (Arabic)",
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
