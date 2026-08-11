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
      title="العضويات واللجان"
      description="تظهر في صفحة نبذة عني."
      fields={[
        { name: "title", label: "العنوان" },
        { name: "titleAr", label: "العنوان (بالعربية)" },
        { name: "period", label: "الفترة (مثال: 2014 – 2023)", required: false },
        { name: "description", label: "الوصف", type: "textarea", required: false },
        {
          name: "descriptionAr",
          label: "الوصف (بالعربية)",
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
