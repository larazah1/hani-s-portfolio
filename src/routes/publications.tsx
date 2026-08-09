import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Section, EmptyNote } from "@/components/site/Section";
import { PublicationCard } from "@/components/site/PublicationCard";
import { publications, type Publication } from "@/content/site";

const title = "Publications — Dr. Hani Mahmoud Zahran";
const description =
  "Research, studies and scientific contributions spanning geophysics, seismology, seismic hazards and geological sciences by Dr. Hani Mahmoud Zahran.";

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

const selectClass =
  "rounded-sm border border-input bg-card px-4 py-2.5 text-sm outline-none focus:border-accent";

const GROUPS: { heading: string; types: Publication["type"][] }[] = [
  { heading: "Journal Articles", types: ["Journal Article"] },
  { heading: "Scientific Books", types: ["Scientific Book"] },
  { heading: "Reports & Other", types: ["Report", "Conference Paper", "Other"] },
];

function PublicationsPage() {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("All");
  const [type, setType] = useState("All");
  const [area, setArea] = useState("All");

  const years = useMemo(
    () => ["All", ...Array.from(new Set(publications.map((p) => p.year))).sort((a, b) => b - a)],
    [],
  );
  const types = useMemo(
    () => ["All", ...Array.from(new Set(publications.map((p) => p.type)))],
    [],
  );
  const areas = useMemo(
    () => ["All", ...Array.from(new Set(publications.map((p) => p.area))).sort()],
    [],
  );

  const filtered = publications.filter((p) => {
    const matchesQuery = `${p.title} ${p.authors} ${p.journal}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesYear = year === "All" || p.year === Number(year);
    const matchesType = type === "All" || p.type === type;
    const matchesArea = area === "All" || p.area === area;
    return matchesQuery && matchesYear && matchesType && matchesArea;
  });

  return (
    <Section eyebrow="Research output" title="Publications">
      <p className="-mt-4 mb-8 max-w-2xl text-sm text-muted-foreground">
        Research, studies, and scientific contributions spanning geophysics, seismology, seismic
        hazards, and geological sciences.
      </p>

      <div className="mb-10 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto]">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search publications"
          className={selectClass}
        />
        <select value={year} onChange={(e) => setYear(e.target.value)} className={selectClass}>
          {years.map((y) => (
            <option key={y} value={y}>
              {y === "All" ? "All years" : y}
            </option>
          ))}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)} className={selectClass}>
          {types.map((t) => (
            <option key={t} value={t}>
              {t === "All" ? "All types" : t}
            </option>
          ))}
        </select>
        <select value={area} onChange={(e) => setArea(e.target.value)} className={selectClass}>
          {areas.map((a) => (
            <option key={a} value={a}>
              {a === "All" ? "All areas" : a}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyNote>No publications match your filters.</EmptyNote>
      ) : (
        <div className="space-y-14">
          {GROUPS.map((group) => {
            const items = filtered.filter((p) => group.types.includes(p.type));
            if (items.length === 0) return null;
            return (
              <div key={group.heading}>
                <h3 className="mb-5 font-[family-name:var(--font-display)] text-2xl font-bold">
                  {group.heading}
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((p) => (
                    <PublicationCard key={p.id} publication={p} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Section>
  );
}
