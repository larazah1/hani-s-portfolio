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
      title="Statistics"
      description="Shown as the stat row on the homepage (e.g. Years of Experience, Publications)."
      fields={[
        { name: "label", label: "Label" },
        { name: "labelAr", label: "Label (Arabic)" },
        { name: "value", label: "Value (e.g. 34+)" },
      ]}
      api={statsCrud}
      getRowTitle={(row: CrudRow) => String(row["label"])}
      getRowSubtitle={(row: CrudRow) => String(row["value"])}
    />
  );
}
