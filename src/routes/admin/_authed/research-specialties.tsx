import { createFileRoute } from "@tanstack/react-router";
import { CollectionCrudScreen, type CrudRow } from "@/components/admin/CollectionCrudScreen";
import { researchSpecialtiesCrud } from "@/server-fns/collections/research-specialties";

export const Route = createFileRoute("/admin/_authed/research-specialties")({
  component: ResearchSpecialtiesPage,
});

function ResearchSpecialtiesPage() {
  return (
    <CollectionCrudScreen
      queryKey="research-specialties"
      title="التخصصات البحثية"
      description="تظهر في صفحة نبذة عني."
      fields={[
        { name: "en", label: "الإنجليزية" },
        { name: "ar", label: "العربية" },
      ]}
      api={researchSpecialtiesCrud}
      getRowTitle={(row: CrudRow) => String(row["en"])}
    />
  );
}
