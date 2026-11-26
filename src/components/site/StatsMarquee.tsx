export type MarqueeStat = { id: string; value: string; label: string };

/**
 * Continuously scrolling row of key figures. The list is rendered twice so the
 * loop is seamless; the copy is hidden from screen readers. Pauses on hover and
 * stops entirely for visitors who prefer reduced motion (see styles.css).
 */
export function StatsMarquee({
  stats,
  label,
  tone = "light",
}: {
  stats: MarqueeStat[];
  label: string;
  /** "dark": deep navy band with gold figures (home page, above the quote). */
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  if (stats.length === 0) return null;
  // Repeat so one copy is always wider than the widest screen.
  const row = [...stats, ...stats];

  return (
    <section
      aria-label={label}
      className={`marquee overflow-hidden ${
        dark ? "bg-surface-deep text-surface-deep-foreground" : ""
      }`}
    >
      <div className="marquee-track flex w-max">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1 || undefined} className="flex shrink-0">
            {row.map((s, i) => (
              <li
                key={`${s.id}-${i}`}
                aria-hidden={i >= stats.length || undefined}
                className={`flex items-baseline gap-3 px-8 md:px-12 ${dark ? "py-5 md:py-6" : "py-8"}`}
              >
                <span
                  dir="ltr"
                  className={`font-[family-name:var(--font-display)] text-3xl font-semibold tabular-nums md:text-4xl ${
                    dark ? "text-accent" : "text-brand-blue"
                  }`}
                >
                  {s.value}
                </span>
                <span
                  className={`text-sm whitespace-nowrap ${
                    dark ? "text-surface-deep-foreground/65" : "text-muted-foreground"
                  }`}
                >
                  {s.label}
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
