import { createFileRoute, notFound } from "@tanstack/react-router";
import { SectionRenderer } from "@/components/site/SectionRenderer";
import { getPageByPath } from "@/server-fns/public-content";

export const Route = createFileRoute("/")({
  loader: async () => {
    const result = await getPageByPath({ data: { path: "/" } });
    if (!result) throw notFound();
    return result;
  },
  head: ({ loaderData }) => {
    const title = loaderData?.page.metaTitle ?? loaderData?.page.title ?? "Dr. Hani Mahmoud Zahran";
    const description = loaderData?.page.metaDescription ?? "";
    const profile = loaderData?.profile;
    const socialLinks = loaderData?.socialLinks ?? [];

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "profile" },
        { name: "twitter:card", content: "summary_large_image" },
        // Person structured data — helps search engines recognize this site
        // as the authoritative result for searches on his name.
        ...(profile
          ? [
              {
                "script:ld+json": {
                  "@context": "https://schema.org",
                  "@type": "Person",
                  name: profile.name,
                  alternateName: profile.nameAr,
                  jobTitle: profile.title,
                  description: profile.tagline,
                  email: `mailto:${profile.email}`,
                  address: { "@type": "PostalAddress", addressLocality: profile.location },
                  sameAs: socialLinks.map((s) => s.url),
                },
              },
            ]
          : []),
      ],
    };
  },
  component: IndexPage,
});

function IndexPage() {
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
