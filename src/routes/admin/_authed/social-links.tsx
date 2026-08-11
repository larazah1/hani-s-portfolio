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
      title="روابط التواصل الاجتماعي"
      description="تظهر في التذييل وصفحة التواصل. لا تظهر في الموقع العام إلا عند توفر رابط."
      fields={[
        { name: "label", label: "التسمية (مثال: LinkedIn)" },
        { name: "url", label: "الرابط" },
      ]}
      api={socialLinksCrud}
      getRowTitle={(row: CrudRow) => String(row["label"])}
      getRowSubtitle={(row: CrudRow) => String(row["url"])}
    />
  );
}
