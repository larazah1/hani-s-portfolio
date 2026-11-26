import { useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import { useLanguage, type DictionaryKey } from "@/lib/language";
import { MetaLine } from "./Section";
import { PreviewCard } from "./PreviewCard";
import type { PreviewItem } from "./LinkPreview";
import { SourceBadge, SourceCover } from "./SourceLogo";
import { sourceName } from "@/lib/media-sources";

export type MediaItem = {
  id: string;
  title: string;
  titleAr?: string | null;
  source: string;
  date: string;
  type: string;
  description?: string | null;
  videoUrl?: string | null;
  articleUrl?: string | null;
  thumbnail?: string | null;
  featured?: boolean | null;
};

function youTubeVideoId(url?: string | null) {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/,
  );
  return match ? match[1] : null;
}

/** The admin-set thumbnail, else the YouTube one for YouTube videos. */
export function mediaImage(item: MediaItem) {
  if (item.thumbnail) return item.thumbnail;
  const id = youTubeVideoId(item.videoUrl);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

const typeLabelKey: Record<string, DictionaryKey> = {
  Video: "video",
  Interview: "interview",
  Article: "article",
};

function useMediaText(item: MediaItem) {
  const { t, pick, language } = useLanguage();
  const key = typeLabelKey[item.type];
  return {
    title: pick(item.title, item.titleAr ?? item.title),
    typeLabel: key ? t(key) : item.type,
    /** Outlet name in the visitor's language (as stored if unknown). */
    source: sourceName(item.source, language),
  };
}

function previewOf(item: MediaItem, url: string | null | undefined): PreviewItem | null {
  if (!url) return null;
  return {
    url,
    title: item.title,
    meta: [item.source, item.date].filter(Boolean).join(" · "),
    image: mediaImage(item),
  };
}

function Thumb({ item, playSize = "md" }: { item: MediaItem; playSize?: "md" | "lg" }) {
  const [broken, setBroken] = useState(false);
  const { language } = useLanguage();
  const image = mediaImage(item);
  const play: readonly [string, string] =
    playSize === "lg" ? ["h-14 w-14", "h-6 w-6"] : ["h-12 w-12", "h-5 w-5"];

  if (!image || broken) {
    return (
      // No picture: the linked site's logo (or the outlet's name without one).
      <div className="relative">
        <SourceCover
          url={item.videoUrl ?? item.articleUrl}
          name={sourceName(item.source, language)}
        />
        {item.videoUrl && <PlayBadge sizes={play} />}
      </div>
    );
  }
  return (
    <div className="relative aspect-video w-full overflow-hidden bg-muted">
      <img
        src={image}
        alt=""
        loading="lazy"
        onError={() => setBroken(true)}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
      {item.videoUrl && <PlayBadge sizes={play} />}
    </div>
  );
}

function PlayBadge({ sizes }: { sizes: readonly [string, string] }) {
  return (
    <span className="absolute inset-0 flex items-center justify-center">
      <span
        className={`flex items-center justify-center rounded-full bg-black/60 text-white ${sizes[0]}`}
      >
        <Play className={`fill-current ${sizes[1]}`} aria-hidden />
      </span>
    </span>
  );
}

/** Home page carousel card: the whole card opens the preview overlay. */
export function MediaCard({ item }: { item: MediaItem }) {
  const { title, typeLabel, source } = useMediaText(item);
  return (
    <PreviewCard
      item={previewOf(item, item.videoUrl ?? item.articleUrl)}
      className="group flex h-full w-full flex-col overflow-hidden rounded-md border border-border bg-card text-start transition-colors hover:border-primary"
    >
      <Thumb item={item} playSize="lg" />
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <p className="eyebrow">{typeLabel}</p>
        <h3 dir="auto" className="mt-2 line-clamp-3 text-lg leading-snug">
          {title}
        </h3>
        <MetaLine
          parts={[source, item.date]}
          className="mt-auto pt-3 text-sm text-muted-foreground"
        />
      </div>
    </PreviewCard>
  );
}

/** Interviews page: a video tile. */
export function VideoTile({ item }: { item: MediaItem }) {
  const { title, source } = useMediaText(item);
  return (
    <PreviewCard
      item={previewOf(item, item.videoUrl)}
      className="group flex flex-col overflow-hidden rounded-md border border-border bg-card text-start transition-colors hover:border-accent"
    >
      <Thumb item={item} />
      <div className="p-5">
        <MetaLine className="eyebrow" parts={[source, item.date]} />
        <h4 dir="auto" className="mt-2 text-base leading-snug">
          {title}
        </h4>
      </div>
    </PreviewCard>
  );
}

/** Interviews page: one row in the press-articles list. */
export function ArticleRow({ item }: { item: MediaItem }) {
  const { t } = useLanguage();
  const { title, source } = useMediaText(item);
  return (
    <PreviewCard
      item={previewOf(item, item.articleUrl)}
      className="group grid w-full gap-1 px-6 py-5 text-start transition-colors hover:bg-muted/60 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-6"
    >
      <div className="flex min-w-0 items-center gap-4">
        <SourceBadge url={item.articleUrl} />
        <div className="min-w-0">
          <MetaLine className="eyebrow" parts={[source, item.date]} />
          <h4 dir="auto" className="mt-1.5 text-base leading-snug">
            {title}
          </h4>
        </div>
      </div>
      {item.articleUrl && (
        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground group-hover:text-foreground">
          {t("readArticle")}
          <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden />
        </span>
      )}
    </PreviewCard>
  );
}
