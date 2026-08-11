import { createFileRoute } from "@tanstack/react-router";
import { CollectionCrudScreen, type CrudRow } from "@/components/admin/CollectionCrudScreen";
import { careerCrud } from "@/server-fns/collections/career";
import { collaborationsCrud } from "@/server-fns/collections/collaborations";

export const Route = createFileRoute("/admin/_authed/career")({
  component: CareerPage,
});

const careerFields = [
  { name: "position", label: "Position" },
  { name: "positionAr", label: "Position (Arabic)" },
  { name: "organization", label: "Organization" },
  { name: "organizationAr", label: "Organization (Arabic)" },
  { name: "startLabel", label: "Start (e.g. Jan 2020)" },
  { name: "endLabel", label: "End (e.g. Present)" },
  { name: "description", label: "Description", type: "textarea" as const, required: false },
  {
    name: "descriptionAr",
    label: "Description (Arabic)",
    type: "textarea" as const,
    required: false,
  },
];

function CareerPage() {
  return (
    <div className="space-y-14">
      <CollectionCrudScreen
        queryKey="career-entries"
        title="Career Highlights"
        description="Positions shown on the homepage timeline and the About page experience list."
        fields={careerFields}
        api={careerCrud}
        getRowTitle={(row: CrudRow) => String(row["position"])}
        getRowSubtitle={(row: CrudRow) =>
          `${row["organization"]} · ${row["startLabel"]} — ${row["endLabel"]}`
        }
      />

      <CollectionCrudScreen
        queryKey="collaborations"
        title="Research Collaborations"
        description="Shown as a callout beneath the career timeline on the homepage."
        fields={careerFields}
        api={collaborationsCrud}
        getRowTitle={(row: CrudRow) => String(row["position"])}
        getRowSubtitle={(row: CrudRow) =>
          `${row["organization"]} · ${row["startLabel"]} — ${row["endLabel"]}`
        }
      />
    </div>
  );
}
