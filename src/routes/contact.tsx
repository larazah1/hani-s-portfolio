import { createFileRoute, notFound } from "@tanstack/react-router";
import { SectionRenderer } from "@/components/site/SectionRenderer";
import { getPageByPath } from "@/server-fns/public-content";

export const Route = createFileRoute("/contact")({
  loader: async () => {
    const result = await getPageByPath({ data: { path: "/contact" } });
    if (!result) throw notFound();
    return result;
  },
  head: ({ loaderData }) => {
    const title = loaderData?.page.metaTitle ?? loaderData?.page.title ?? "Contact";
    const description = loaderData?.page.metaDescription ?? "";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ContactPage,
});

function ContactPage() {
  const { sections, profile, socialLinks } = Route.useLoaderData();
  return (
    <>
      {sections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          profile={profile}
          socialLinks={socialLinks}
        />
      ))}
    </>
  );
}
