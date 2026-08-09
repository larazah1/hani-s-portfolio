import { ExternalLink, FileText } from "lucide-react";
import type { Publication } from "@/content/site";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

function publicationHref(p: Publication) {
  return p.url ?? (p.doi ? `https://doi.org/${p.doi}` : undefined);
}

function GoToPublicationButton({ publication, className }: { publication: Publication; className?: string }) {
  const href = publicationHref(publication);
  if (!href) {
    return (
      <Button variant="outline" size="sm" disabled className={className}>
        Link coming soon
      </Button>
    );
  }
  return (
    <Button variant="outline" size="sm" asChild className={className}>
      <a href={href} target="_blank" rel="noreferrer noopener">
        Go to Publication
        <ExternalLink />
      </a>
    </Button>
  );
}

export function PublicationCard({ publication }: { publication: Publication }) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-md">
      <div className="flex items-center gap-2">
        <p className="eyebrow">
          {publication.year} · {publication.type}
        </p>
      </div>
      <h3 className="mt-2 text-lg leading-snug font-semibold">{publication.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{publication.authors}</p>
      <p className="text-sm text-muted-foreground">{publication.journal}</p>
      {publication.summary && (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{publication.summary}</p>
      )}
      <div className="mt-5 flex flex-wrap gap-2 pt-1">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" size="sm">
              <FileText />
              View
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
            <DialogHeader>
              <p className="eyebrow">
                {publication.year} · {publication.type} · {publication.area}
              </p>
              <DialogTitle className="font-[family-name:var(--font-display)] text-xl font-normal leading-snug">
                {publication.title}
              </DialogTitle>
              <DialogDescription className="pt-1">
                {publication.authors} · {publication.journal}
              </DialogDescription>
            </DialogHeader>
            {publication.summary && (
              <p className="text-sm leading-relaxed text-muted-foreground">{publication.summary}</p>
            )}
            {publication.doi && (
              <p className="text-sm text-muted-foreground">
                DOI: <span className="font-mono text-xs">{publication.doi}</span>
              </p>
            )}
            <div className="pt-2">
              <GoToPublicationButton publication={publication} />
            </div>
          </DialogContent>
        </Dialog>
        <GoToPublicationButton publication={publication} />
      </div>
    </article>
  );
}

export function PublicationAreaBadge({ area }: { area: string }) {
  return (
    <Badge variant="outline" className="font-normal text-muted-foreground">
      {area}
    </Badge>
  );
}
