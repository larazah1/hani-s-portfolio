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
      title="مجالات الخبرة"
      description="تظهر ضمن شبكة أبرز مجالات الخبرة في الصفحة الرئيسية."
      fields={[
        { name: "en", label: "الإنجليزية" },
        { name: "ar", label: "العربية" },
      ]}
      api={expertiseCrud}
      getRowTitle={(row: CrudRow) => String(row["en"])}
    />
  );
}
