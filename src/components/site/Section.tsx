import type { ReactNode } from "react";

export function Section({
  title,
  action,
  id,
  children,
  className = "",
}: {
  title?: string;
  /** Rendered on the opposite side of the title, same line —
   * `justify-between` on a flex row mirrors automatically under RTL, so no
   * direction-specific positioning is needed here. */
  action?: ReactNode;
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`mx-auto max-w-6xl px-5 py-16 md:py-20 ${className}`}>
      {(title || action) && (
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            {title && <h2 className="text-3xl md:text-4xl">{title}</h2>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function EmptyNote({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-md border border-dashed border-border bg-card px-5 py-8 text-sm text-muted-foreground">
      {children}
    </p>
  );
}

/**
 * "Source · date" style metadata. Each part is isolated with <bdi> so Arabic
 * and English fragments don't reorder each other.
 */
export function MetaLine({
  parts,
  className = "",
}: {
  parts: (string | number | null | undefined)[];
  className?: string;
}) {
  const shown = parts.filter((p) => p !== null && p !== undefined && p !== "");
  return (
    <p className={className}>
      {shown.map((p, i) => (
        <span key={i}>
          {i > 0 && " · "}
          <bdi>{p}</bdi>
        </span>
      ))}
    </p>
  );
}
