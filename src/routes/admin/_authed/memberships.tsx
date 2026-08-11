import { createFileRoute } from "@tanstack/react-router";
import { CollectionCrudScreen, type CrudRow } from "@/components/admin/CollectionCrudScreen";
import { membershipsCrud } from "@/server-fns/collections/memberships";

export const Route = createFileRoute("/admin/_authed/memberships")({
  component: MembershipsPage,
});

function MembershipsPage() {
  return (
    <CollectionCrudScreen
      queryKey="memberships"
      title="Memberships & Committees"
      description="Shown on the About page."
      fields={[
        { name: "title", label: "Title" },
        { name: "titleAr", label: "Title (Arabic)" },
        { name: "period", label: "Period (e.g. 2014 – 2023)", required: false },
        { name: "description", label: "Description", type: "textarea", required: false },
        {
          name: "descriptionAr",
          label: "Description (Arabic)",
          type: "textarea",
          required: false,
        },
      ]}
      api={membershipsCrud}
      getRowTitle={(row: CrudRow) => String(row["title"])}
      getRowSubtitle={(row: CrudRow) => (row["period"] ? String(row["period"]) : undefined)}
    />
  );
}
