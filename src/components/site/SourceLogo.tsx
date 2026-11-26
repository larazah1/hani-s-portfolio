import { logoFor } from "@/lib/media-sources";

/**
 * Cover for an interview/article with no picture: just the linked site's logo,
 * centred on white. Without a saved logo, the outlet's name on deep navy.
 */
export function SourceCover({ url, name }: { url: string | null | undefined; name: string }) {
  const logo = logoFor(url);
  if (logo) {
    return (
      <div className="flex aspect-video w-full items-center justify-center border-b border-border bg-white p-6">
        <img src={logo} alt={name} loading="lazy" className="h-3/5 max-w-[60%] object-contain" />
      </div>
    );
  }
  return (
    <div className="flex aspect-video w-full items-end bg-surface-deep p-6 text-surface-deep-foreground">
      <span className="text-2xl font-medium opacity-90">{name}</span>
    </div>
  );
}

/** Small logo tile for list rows; renders nothing without a saved logo. */
export function SourceBadge({ url }: { url: string | null | undefined }) {
  const logo = logoFor(url);
  if (!logo) return null;
  return (
    <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-white p-1.5">
      <img src={logo} alt="" loading="lazy" className="max-h-full max-w-full object-contain" />
    </span>
  );
}
