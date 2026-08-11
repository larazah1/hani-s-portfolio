import { createFileRoute } from "@tanstack/react-router";
import { CollectionCrudScreen, type CrudRow } from "@/components/admin/CollectionCrudScreen";
import { interestsCrud } from "@/server-fns/collections/interests";

export const Route = createFileRoute("/admin/_authed/interests")({
  component: InterestsPage,
});

function InterestsPage() {
  return (
    <CollectionCrudScreen
      queryKey="interests"
      title="Interests"
      description="Shown on the About page."
      fields={[
        { name: "en", label: "English" },
        { name: "ar", label: "Arabic" },
      ]}
      api={interestsCrud}
      getRowTitle={(row: CrudRow) => String(row["en"])}
    />
  );
}
