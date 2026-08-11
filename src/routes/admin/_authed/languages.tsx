import { createFileRoute } from "@tanstack/react-router";
import { CollectionCrudScreen, type CrudRow } from "@/components/admin/CollectionCrudScreen";
import { languagesCrud } from "@/server-fns/collections/languages";

export const Route = createFileRoute("/admin/_authed/languages")({
  component: LanguagesPage,
});

function LanguagesPage() {
  return (
    <CollectionCrudScreen
      queryKey="languages"
      title="Languages"
      description="Shown on the About page."
      fields={[
        { name: "en", label: "English" },
        { name: "ar", label: "Arabic" },
      ]}
      api={languagesCrud}
      getRowTitle={(row: CrudRow) => String(row["en"])}
    />
  );
}
