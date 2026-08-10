import { createFileRoute } from "@tanstack/react-router";
import { Section, EmptyNote } from "@/components/site/Section";
import { MediaCard } from "@/components/site/MediaCard";
import { media } from "@/content/site";
import { useLanguage } from "@/lib/language";

const title = "Interviews & Articles — Dr. Hani Mahmoud Zahran";
const description =
  "Media appearances, interviews, video features and articles by and about Dr. Hani Mahmoud Zahran.";

export const Route = createFileRoute("/interviews")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InterviewsPage,
});

function InterviewsPage() {
  const { t } = useLanguage();
  return (
    <Section eyebrow={t("media")} title={t("interviewsArticlesHeadline")}>
      <p className="-mt-4 mb-8 max-w-2xl text-sm text-muted-foreground">
        {t("interviewsArticlesIntro")}
      </p>
      {media.length === 0 ? (
        <EmptyNote>{t("emptyInterviews")}</EmptyNote>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {media.map((m) => (
            <MediaCard key={m.id} item={m} />
          ))}
        </div>
      )}
    </Section>
  );
}
