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
      title="الاهتمامات"
      description="تظهر في صفحة نبذة عني."
      fields={[
        { name: "en", label: "الإنجليزية" },
        { name: "ar", label: "العربية" },
      ]}
      api={interestsCrud}
      getRowTitle={(row: CrudRow) => String(row["en"])}
    />
  );
}
