import type { ReactNode } from "react";

export function Section({
  eyebrow,
  title,
  children,
  className = "",
}: {
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`mx-auto max-w-6xl px-5 py-10 md:py-14 ${className}`}>
      {(eyebrow || title) && (
        <header className="mb-8 max-w-2xl">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          {title && <h2 className="mt-3 text-3xl font-bold md:text-4xl">{title}</h2>}
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