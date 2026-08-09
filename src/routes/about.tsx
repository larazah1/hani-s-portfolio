import { createFileRoute } from "@tanstack/react-router";
import { Section, EmptyNote } from "@/components/site/Section";
import {
  activities,
  biography,
  career,
  education,
  interests,
  languages,
  memberships,
  researchSpecialties,
} from "@/content/site";

const title = "About — Dr. Hani Mahmoud Zahran";
const description =
  "Biography, education, experience, research specialties, memberships and scientific activities of Dr. Hani Mahmoud Zahran.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function List({ items, empty }: { items: string[]; empty: string }) {
  if (items.length === 0) return <EmptyNote>{empty}</EmptyNote>;
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((i) => (
        <li key={i} className="rounded-sm border border-border bg-card px-4 py-2 text-sm">
          {i}
        </li>
      ))}
    </ul>
  );
}

function AboutPage() {
  return (
    <>
      <Section eyebrow="About" title="Biography">
        <div className="max-w-3xl space-y-4 text-[0.98rem] leading-relaxed text-muted-foreground">
          {biography.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      </Section>

      <Section eyebrow="Education" title="Academic background">
        {education.length === 0 ? (
          <EmptyNote>Education entries will appear here once added.</EmptyNote>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {education.map((e) => (
              <article
                key={`${e.degree}-${e.year}`}
                className="rounded-md border border-border bg-card p-6"
              >
                <p className="eyebrow">{e.year}</p>
                <h3 className="mt-2 text-lg font-semibold">
                  {e.degree} · {e.field}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {e.university}, {e.location}
                </p>
                {e.description && (
                  <p className="mt-2 text-sm text-muted-foreground">{e.description}</p>
                )}
              </article>
            ))}
          </div>
        )}
      </Section>

      <Section eyebrow="Experience" title="Professional experience">
        {career.length === 0 ? (
          <EmptyNote>Experience entries will appear here once added.</EmptyNote>
        ) : (
          <ol className="border-l border-border">
            {career.map((c) => (
              <li key={`${c.position}-${c.start}`} className="relative pb-10 pl-8">
                <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-accent" />
                <p className="eyebrow">
                  {c.start} — {c.end}
                </p>
                <h3 className="mt-1 text-xl font-semibold">{c.position}</h3>
                <p className="text-sm text-muted-foreground">{c.organization}</p>
              </li>
            ))}
          </ol>
        )}
      </Section>

      <Section eyebrow="Research" title="Research specialties">
        <List
          items={researchSpecialties}
          empty="Research specialties will appear here once added."
        />
      </Section>

      <Section eyebrow="Affiliations" title="Memberships & committees">
        {memberships.length === 0 ? (
          <EmptyNote>Memberships will appear here once added.</EmptyNote>
        ) : (
          <ul className="divide-y divide-border rounded-md border border-border bg-card">
            {memberships.map((m) => (
              <li key={m.title} className="px-6 py-4">
                <p className="text-base font-semibold">{m.title}</p>
                {m.period && <p className="text-sm text-muted-foreground">{m.period}</p>}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section eyebrow="Activities" title="Scientific activities">
        <List items={activities} empty="Scientific activities will appear here once added." />
      </Section>

      <Section eyebrow="Languages" title="Languages">
        <List items={languages} empty="Languages will appear here once added." />
      </Section>

      <Section eyebrow="Personal" title="Interests">
        <List items={interests} empty="Interests will appear here once added." />
      </Section>
    </>
  );
}
