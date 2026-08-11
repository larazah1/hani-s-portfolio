import { createFileRoute } from "@tanstack/react-router";
import { CollectionCrudScreen, type CrudRow } from "@/components/admin/CollectionCrudScreen";
import { statsCrud } from "@/server-fns/collections/stats";

export const Route = createFileRoute("/admin/_authed/stats")({
  component: StatsPage,
});

function StatsPage() {
  return (
    <CollectionCrudScreen
      queryKey="stats"
      title="الإحصائيات"
      description="تظهر كصف إحصائيات في الصفحة الرئيسية (مثال: سنوات الخبرة، المنشورات)."
      fields={[
        { name: "label", label: "التسمية" },
        { name: "labelAr", label: "التسمية (بالعربية)" },
        { name: "value", label: "القيمة (مثال: 34+)" },
      ]}
      api={statsCrud}
      getRowTitle={(row: CrudRow) => String(row["label"])}
      getRowSubtitle={(row: CrudRow) => String(row["value"])}
    />
  );
}
