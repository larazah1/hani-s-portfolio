import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Section, EmptyNote } from "@/components/site/Section";
import { publications } from "@/content/site";

const title = "Publications — Dr. Hani Mahmoud Zahran";
const description =
  "Peer-reviewed articles, scientific books, conference papers and reports authored by Dr. Hani Mahmoud Zahran.";

export const Route = createFileRoute("/publications")({
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
  component: PublicationsPage,
});

function PublicationsPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");

  const types = useMemo(
    () => ["All", ...Array.from(new Set(publications.map((p) => p.type)))],
    [],
  );

  const filtered = publications.filter((p) => {
    const matchesQuery = `${p.title} ${p.authors} ${p.journal}`
      .toLowerCase()
      .includes(query.toLowerCase());
    return matchesQuery && (type === "All" || p.type === type);
  });

  return (
    <Section eyebrow="Research output" title="Publications">
      <div className="mb-8 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, author or journal"
          className="w-full rounded-sm border border-input bg-card px-4 py-2.5 text-sm outline-none focus:border-accent"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-sm border border-input bg-card px-4 py-2.5 text-sm outline-none focus:border-accent"
        >
          {types.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyNote>No publications to show yet.</EmptyNote>
      ) : (
        <ul className="divide-y divide-border rounded-md border border-border bg-card">
          {filtered.map((p) => (
            <li key={p.id} className="px-6 py-5">
              <p className="eyebrow">{p.year} · {p.type} · {p.area}</p>
              <h3 className="mt-1.5 text-lg leading-snug">{p.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.authors}</p>
              <p className="text-sm text-muted-foreground">{p.journal}</p>
              {(p.url || p.doi) && (
                <a
                  href={p.url ?? `https://doi.org/${p.doi}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-2 inline-block text-sm underline underline-offset-4"
                >
                  View publication
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}