import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, Compass, Loader2, X } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { checkEmbeddable } from "@/server-fns/preview";

export type PreviewItem = {
  url: string;
  title: string;
  /** Source, journal, date… shown under the title. */
  meta?: string | undefined;
  image?: string | null | undefined;
};

const PreviewContext = createContext<(item: PreviewItem) => void>(() => {});

/** Opens the preview overlay for a link. */
export const usePreview = () => useContext(PreviewContext);

export function PreviewProvider({ children }: { children: ReactNode }) {
  const [item, setItem] = useState<PreviewItem | null>(null);
  return (
    <PreviewContext.Provider value={setItem}>
      {children}
      <PreviewDialog item={item} onClose={() => setItem(null)} />
    </PreviewContext.Provider>
  );
}

export function youtubeId(url: string) {
  const m = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/.exec(url);
  return m?.[1] ?? null;
}

// Remembers which sites allow being shown in a frame, per page load.
const embeddableCache = new Map<string, boolean>();

function PreviewDialog({ item, onClose }: { item: PreviewItem | null; onClose: () => void }) {
  const { t, dir } = useLanguage();
  const video = item ? youtubeId(item.url) : null;
  const [embeddable, setEmbeddable] = useState<boolean | null>(null);

  useEffect(() => {
    if (!item || video) return;
    const cached = embeddableCache.get(item.url);
    if (cached !== undefined) {
      setEmbeddable(cached);
      return;
    }
    setEmbeddable(null);
    let live = true;
    checkEmbeddable({ data: item.url })
      .catch(() => false)
      .then((ok) => {
        embeddableCache.set(item.url, ok);
        if (live) setEmbeddable(ok);
      });
    return () => {
      live = false;
    };
  }, [item, video]);

  const host = item ? new URL(item.url).hostname.replace(/^www\./, "") : "";
  const iconBtn =
    "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted/70 text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring";
  // Full height only when a page is actually framed; otherwise a compact card.
  const framed = !video && embeddable === true;
  const size = video ? "max-w-3xl" : framed ? "h-[85vh] max-w-3xl" : "max-w-md";

  return (
    <Dialog.Root open={!!item} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          dir={dir}
          className={`fixed inset-x-3 top-1/2 z-[101] mx-auto flex max-h-[90vh] -translate-y-1/2 flex-col overflow-hidden rounded-3xl border border-white/10 bg-background shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)] outline-none transition-[max-width] duration-300 ease-out data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 ${size}`}
        >
          {item && (
            <>
              <header className="flex items-center gap-3 border-b border-border/70 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <Dialog.Title dir="auto" className="truncate text-base font-semibold">
                    {item.title}
                  </Dialog.Title>
                  <Dialog.Description className="mt-0.5 truncate text-xs text-muted-foreground">
                    <bdi>{item.meta || host}</bdi>
                  </Dialog.Description>
                </div>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={t("previewOpen")}
                  title={t("previewOpen")}
                  className={iconBtn}
                >
                  <Compass className="h-4 w-4" aria-hidden />
                </a>
                <Dialog.Close
                  aria-label={t("previewClose")}
                  title={t("previewClose")}
                  className={iconBtn}
                >
                  <X className="h-4 w-4" aria-hidden />
                </Dialog.Close>
              </header>

              {video ? (
                <div className="aspect-video w-full overflow-hidden bg-black">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${video}?autoplay=1&rel=0`}
                    title={item.title}
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              ) : embeddable === null ? (
                <div className="flex min-h-48 flex-1 items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  {t("previewLoading")}
                </div>
              ) : embeddable ? (
                <iframe
                  src={item.url}
                  title={item.title}
                  referrerPolicy="no-referrer"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  className="w-full flex-1 bg-white"
                />
              ) : (
                <div className="flex flex-col gap-5 overflow-auto p-5 sm:p-6">
                  {item.image && (
                    <img
                      src={item.image}
                      alt=""
                      className="aspect-video w-full rounded-2xl object-cover"
                    />
                  )}
                  <p dir="auto" className="text-lg leading-snug font-semibold">
                    {item.title}
                  </p>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    {t("previewOpen")}
                    <span className="opacity-70">
                      · <bdi>{host}</bdi>
                    </span>
                    <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden />
                  </a>
                </div>
              )}
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
