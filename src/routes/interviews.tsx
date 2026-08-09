import { createFileRoute } from "@tanstack/react-router";
import { Section, EmptyNote } from "@/components/site/Section";
import { media } from "@/content/site";

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
  return (
    <Section eyebrow="Media" title="Interviews & articles">
      {media.length === 0 ? (
        <EmptyNote>Interviews and articles will appear here once added.</EmptyNote>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {media.map((m) => (
            <article key={m.id} className="rounded-md border border-border bg-card p-6">
              <p className="eyebrow">{m.date} · {m.type}</p>
              <h3 className="mt-2 text-lg leading-snug">{m.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{m.source}</p>
              {m.description && (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{m.description}</p>
              )}
              <div className="mt-4 flex gap-4 text-sm">
                {m.videoUrl && (
                  <a href={m.videoUrl} target="_blank" rel="noreferrer noopener" className="underline underline-offset-4">
                    Watch video
                  </a>
                )}
                {m.articleUrl && (
                  <a href={m.articleUrl} target="_blank" rel="noreferrer noopener" className="underline underline-offset-4">
                    Read article
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </Section>
  );
}