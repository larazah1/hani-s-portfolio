import { ExternalLink } from "lucide-react";
import type { Publication } from "@/content/site";
import { Button } from "@/components/ui/button";

function publicationHref(p: Publication) {
  return p.url ?? (p.doi ? `https://doi.org/${p.doi}` : undefined);
}

export function PublicationCard({ publication }: { publication: Publication }) {
  const href = publicationHref(publication);

  return (
    <article className="flex h-full flex-col rounded-lg border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-md">
      <p className="eyebrow">
        {publication.year} · {publication.type}
      </p>
      <h3 className="mt-2 text-lg leading-snug font-semibold">{publication.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{publication.authors}</p>
      <p className="text-sm text-muted-foreground">{publication.journal}</p>
      {publication.summary && (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{publication.summary}</p>
      )}
      {publication.doi && (
        <p className="mt-2 text-xs text-muted-foreground">
          DOI: <span className="font-mono">{publication.doi}</span>
        </p>
      )}
      <div className="mt-5 pt-1">
        {href ? (
          <Button variant="outline" size="sm" asChild>
            <a href={href} target="_blank" rel="noreferrer noopener">
              Go to Publication
              <ExternalLink />
            </a>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            Link coming soon
          </Button>
        )}
      </div>
    </article>
  );
}
