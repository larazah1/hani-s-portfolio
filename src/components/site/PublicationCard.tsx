import { ArrowUpRight } from "lucide-react";
import { publicationTypeAr } from "@/lib/publication-i18n";
import { useLanguage } from "@/lib/language";
import { usePreview } from "./LinkPreview";
import { PreviewCard } from "./PreviewCard";

export type Publication = {
  id: string;
  title: string;
  titleAr: string;
  authors: string;
  journal: string;
  year: number;
  type: string;
  area: string;
  areaAr?: string | null;
  doi?: string | null;
  url?: string | null;
  summary?: string | null;
  featured?: boolean | null;
};

export function publicationHref(p: Publication) {
  return p.url ?? (p.doi ? `https://doi.org/${p.doi}` : undefined);
}

/**
 * compact: the home page carousel card — the whole card opens the link in the
 * preview overlay. Otherwise: the full card used on the publications page.
 */
export function PublicationCard({
  publication: p,
  compact = false,
}: {
  publication: Publication;
  compact?: boolean;
}) {
  const { t, pick } = useLanguage();
  const openPreview = usePreview();
  const href = publicationHref(p);
  const typeLabel = pick(p.type, publicationTypeAr[p.type] ?? p.type);
  const previewItem = href
    ? { url: href, title: p.title, meta: [p.journal, p.year].filter(Boolean).join(" · ") }
    : null;

  if (compact) {
    return (
      <PreviewCard
        item={previewItem}
        className="flex h-full flex-col rounded-md border border-border bg-card p-6 text-start transition-colors hover:border-primary md:p-8"
      >
        <p className="eyebrow">{[p.year, typeLabel].filter(Boolean).join(" · ")}</p>
        <h3 lang="en" dir="auto" className="mt-3 line-clamp-4 text-lg leading-snug">
          {pick(p.title, p.titleAr)}
        </h3>
        {p.journal && (
          <p lang="en" dir="auto" className="mt-2 text-sm text-muted-foreground">
            {p.journal}
          </p>
        )}
        {href && (
          <span className="mt-auto pt-5 text-sm underline underline-offset-4">
            {t("goToPublication")}
          </span>
        )}
      </PreviewCard>
    );
  }

  return (
    <article className="flex h-full flex-col rounded-md border border-border bg-card p-6 transition-colors hover:border-primary">
      <p className="eyebrow">
        {[p.year, typeLabel, p.area && pick(p.area, p.areaAr ?? p.area)]
          .filter(Boolean)
          .join(" · ")}
      </p>
      <h3 lang="en" dir="auto" className="mt-2 text-lg leading-snug">
        {pick(p.title, p.titleAr)}
      </h3>
      {p.authors && (
        <p lang="en" dir="auto" className="mt-2 text-sm text-muted-foreground">
          {p.authors}
        </p>
      )}
      {p.journal && (
        <p lang="en" dir="auto" className="text-sm text-muted-foreground">
          {p.journal}
        </p>
      )}
      {p.summary && (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground" dir="ltr">
          {p.summary}
        </p>
      )}
      {p.doi && (
        <p className="mt-2 text-xs text-muted-foreground">
          {t("doi")}:{" "}
          <span className="font-mono" dir="ltr">
            {p.doi}
          </span>
        </p>
      )}
      <div className="mt-auto pt-5">
        {previewItem ? (
          <button
            type="button"
            onClick={() => openPreview(previewItem)}
            className="inline-flex cursor-pointer items-center gap-1 text-sm underline underline-offset-4"
          >
            {t("goToPublication")}
            <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden />
          </button>
        ) : (
          <span className="text-sm text-muted-foreground">{t("linkComingSoon")}</span>
        )}
      </div>
    </article>
  );
}
