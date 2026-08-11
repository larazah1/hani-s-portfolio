import { useState } from "react";
import { ExternalLink, Eye } from "lucide-react";
import { publicationTypeAr } from "@/lib/publication-i18n";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

export function PublicationCard({
  publication,
  compact = false,
}: {
  publication: Publication;
  compact?: boolean;
}) {
  const { t, pick } = useLanguage();
  const href = publicationHref(publication);
  const [open, setOpen] = useState(false);

  if (compact) {
    return (
      <>
        <article
          role="button"
          tabIndex={0}
          onClick={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpen(true);
            }
          }}
          className="flex h-full cursor-pointer flex-col rounded-lg border border-border bg-card p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-md"
        >
          <p className="eyebrow">{publication.year}</p>
          <h3 className="mt-2 line-clamp-3 text-base leading-snug font-semibold">
            {pick(publication.title, publication.titleAr)}
          </h3>
          <div className="mt-4 flex flex-wrap gap-2 pt-1">
            {href ? (
              <Button variant="outline" size="sm" asChild onClick={(e) => e.stopPropagation()}>
                <a href={href} target="_blank" rel="noreferrer noopener">
                  {t("goToPublication")}
                  <ExternalLink />
                </a>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled onClick={(e) => e.stopPropagation()}>
                {t("linkComingSoon")}
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(true);
              }}
            >
              <Eye />
              {t("view")}
            </Button>
          </div>
        </article>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <p className="eyebrow">
                {publication.year} · {pick(publication.type, publicationTypeAr[publication.type])}
              </p>
              <DialogTitle className="text-xl leading-snug">
                {pick(publication.title, publication.titleAr)}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground" dir="ltr">
                {publication.authors}
              </p>
              <p className="text-sm text-muted-foreground" dir="ltr">
                {publication.journal}
              </p>
              {publication.summary && (
                <p className="text-sm leading-relaxed text-muted-foreground" dir="ltr">
                  {publication.summary}
                </p>
              )}
              {publication.doi && (
                <p className="text-xs text-muted-foreground">
                  {t("doi")}:{" "}
                  <span className="font-mono" dir="ltr">
                    {publication.doi}
                  </span>
                </p>
              )}
            </div>
            <DialogFooter>
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
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

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
