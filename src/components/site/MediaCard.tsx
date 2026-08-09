import { ExternalLink, Eye, Newspaper, Video as VideoIcon, Mic } from "lucide-react";
import type { MediaItem } from "@/content/site";
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

function youTubeEmbedUrl(url?: string) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

function typeMeta(type: MediaItem["type"]) {
  switch (type) {
    case "Video":
      return { icon: VideoIcon, label: "Video", actionLabel: "Watch Video" };
    case "Interview":
      return { icon: Mic, label: "Interview", actionLabel: "Read Article" };
    default:
      return { icon: Newspaper, label: "Article", actionLabel: "Read Article" };
  }
}

function MediaThumb({ item }: { item: MediaItem }) {
  const { icon: Icon } = typeMeta(item.type);
  return (
    <div className="flex aspect-[16/9] items-center justify-center rounded-md border border-border bg-secondary/60">
      <Icon className="h-8 w-8 text-muted-foreground/60" strokeWidth={1.25} />
    </div>
  );
}

export function MediaCard({ item }: { item: MediaItem }) {
  const meta = typeMeta(item.type);
  const primaryUrl = item.videoUrl ?? item.articleUrl;
  const embed = youTubeEmbedUrl(item.videoUrl);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-soft transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-md">
      <div className="p-4 pb-0">
        <MediaThumb item={item} />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-2">
          <p className="eyebrow">
            {item.date} · {item.type}
          </p>
          <Badge variant="secondary" className="font-normal">
            {meta.label}
          </Badge>
        </div>
        <h3 className="mt-2 text-lg leading-snug font-semibold">{item.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{item.source}</p>
        {item.description && (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
        )}

        <div className="mt-5 flex flex-wrap gap-2 pt-1">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm">
                <Eye />
                View
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
              <DialogHeader>
                <p className="eyebrow">
                  {item.date} · {item.type}
                </p>
                <DialogTitle className="font-[family-name:var(--font-display)] text-xl font-normal leading-snug">
                  {item.title}
                </DialogTitle>
                <DialogDescription className="pt-1">{item.source}</DialogDescription>
              </DialogHeader>
              {item.description && (
                <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              )}
              {embed && (
                <div className="aspect-video overflow-hidden rounded-md border border-border">
                  <iframe
                    src={embed}
                    title={item.title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
              {primaryUrl && (
                <div className="pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={primaryUrl} target="_blank" rel="noreferrer noopener">
                      {meta.actionLabel}
                      <ExternalLink />
                    </a>
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {primaryUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={primaryUrl} target="_blank" rel="noreferrer noopener">
                {meta.actionLabel}
                <ExternalLink />
              </a>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
