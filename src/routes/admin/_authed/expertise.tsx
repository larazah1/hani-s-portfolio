import { createFileRoute } from "@tanstack/react-router";
import { CollectionCrudScreen, type CrudRow } from "@/components/admin/CollectionCrudScreen";
import { expertiseCrud } from "@/server-fns/collections/expertise";

export const Route = createFileRoute("/admin/_authed/expertise")({
  component: ExpertisePage,
});

function ExpertisePage() {
  return (
    <CollectionCrudScreen
      queryKey="expertise"
      title="Expertise"
      description="Shown as the Key Expertise grid on the homepage."
      fields={[
        { name: "en", label: "English" },
        { name: "ar", label: "Arabic" },
      ]}
      api={expertiseCrud}
      getRowTitle={(row: CrudRow) => String(row["en"])}
    />
  );
}
