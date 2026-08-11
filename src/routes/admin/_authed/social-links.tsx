import { createFileRoute } from "@tanstack/react-router";
import { CollectionCrudScreen, type CrudRow } from "@/components/admin/CollectionCrudScreen";
import { socialLinksCrud } from "@/server-fns/collections/social-links";

export const Route = createFileRoute("/admin/_authed/social-links")({
  component: SocialLinksPage,
});

function SocialLinksPage() {
  return (
    <CollectionCrudScreen
      queryKey="social-links"
      title="Social Links"
      description="Shown in the footer and contact page. Only appears on the public site when a link is present."
      fields={[
        { name: "label", label: "Label (e.g. LinkedIn)" },
        { name: "url", label: "URL" },
      ]}
      api={socialLinksCrud}
      getRowTitle={(row: CrudRow) => String(row["label"])}
      getRowSubtitle={(row: CrudRow) => String(row["url"])}
    />
  );
}
