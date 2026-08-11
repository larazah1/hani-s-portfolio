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
      title="Research Specialties"
      description="Shown on the About page."
      fields={[
        { name: "en", label: "English" },
        { name: "ar", label: "Arabic" },
      ]}
      api={researchSpecialtiesCrud}
      getRowTitle={(row: CrudRow) => String(row["en"])}
    />
  );
}
