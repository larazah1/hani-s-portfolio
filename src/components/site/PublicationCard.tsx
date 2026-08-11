import { ExternalLink } from "lucide-react";
import { publicationTypeAr } from "@/lib/publication-i18n";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language";

export type Publication = {
  id: string;
  title: string;
  titleAr: string;
  authors: string;
  journal: string;
  year: number;
  type: string;
  area: string;
  doi?: string | null;
  url?: string | null;
  summary?: string | null;
  featured?: boolean | null;
};

function publicationHref(p: Publication) {
  return p.url ?? (p.doi ? `https://doi.org/${p.doi}` : undefined);
}

export function PublicationCard({ publication }: { publication: Publication }) {
  const { t, pick } = useLanguage();
  const href = publicationHref(publication);

  return (
    <article className="flex h-full flex-col rounded-lg border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-md">
      <p className="eyebrow">
        {publication.year} · {pick(publication.type, publicationTypeAr[publication.type])}
      </p>
      <h3 className="mt-2 text-lg leading-snug font-semibold">
        {pick(publication.title, publication.titleAr)}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground" dir="ltr">
        {publication.authors}
      </p>
      <p className="text-sm text-muted-foreground" dir="ltr">
        {publication.journal}
      </p>
      {publication.summary && (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground" dir="ltr">
          {publication.summary}
        </p>
      )}
      {publication.doi && (
        <p className="mt-2 text-xs text-muted-foreground">
          {t("doi")}:{" "}
          <span className="font-mono" dir="ltr">
            {publication.doi}
          </span>
        </p>
      )}
      <div className="mt-5 pt-1">
        {href ? (
          <Button variant="outline" size="sm" asChild>
            <a href={href} target="_blank" rel="noreferrer noopener">
              {t("goToPublication")}
              <ExternalLink />
            </a>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            {t("linkComingSoon")}
          </Button>
        )}
      </div>
    </article>
  );
}
