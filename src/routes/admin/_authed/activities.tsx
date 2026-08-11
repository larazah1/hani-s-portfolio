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
      title="الأنشطة العلمية"
      description="تظهر في صفحة نبذة عني."
      fields={[
        { name: "en", label: "الإنجليزية" },
        { name: "ar", label: "العربية" },
      ]}
      api={activitiesCrud}
      getRowTitle={(row: CrudRow) => String(row["en"])}
    />
  );
}
