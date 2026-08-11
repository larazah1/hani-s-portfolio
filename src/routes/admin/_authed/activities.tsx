import { createFileRoute } from "@tanstack/react-router";
import { CollectionCrudScreen, type CrudRow } from "@/components/admin/CollectionCrudScreen";
import { activitiesCrud } from "@/server-fns/collections/activities";

export const Route = createFileRoute("/admin/_authed/activities")({
  component: ActivitiesPage,
});

function ActivitiesPage() {
  return (
    <CollectionCrudScreen
      queryKey="activities"
      title="Scientific Activities"
      description="Shown on the About page."
      fields={[
        { name: "en", label: "English" },
        { name: "ar", label: "Arabic" },
      ]}
      api={activitiesCrud}
      getRowTitle={(row: CrudRow) => String(row["en"])}
    />
  );
}
