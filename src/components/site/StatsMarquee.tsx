export type MarqueeStat = { id: string; value: string; label: string };

/**
 * Key figures on a seamless, continuous loop (pauses on hover; still for
 * visitors who prefer reduced motion). The list is rendered twice so the
 * track can slide exactly one copy's width.
 */
export function StatsMarquee({ stats, label }: { stats: MarqueeStat[]; label: string }) {
  if (stats.length === 0) return null;
  const row = [...stats, ...stats];

  return (
    <section aria-label={label} className="marquee overflow-hidden">
      <div className="marquee-track flex w-max">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1 || undefined} className="flex shrink-0">
            {row.map((s, i) => (
              <li
                key={`${s.id}-${i}`}
                aria-hidden={i >= stats.length || undefined}
                className="flex items-baseline gap-3 px-8 py-8 md:px-12"
              >
                <span
                  dir="ltr"
                  className="font-[family-name:var(--font-display)] text-3xl font-semibold text-brand-blue tabular-nums md:text-4xl"
                >
                  {s.value}
                </span>
                <span className="text-sm whitespace-nowrap text-muted-foreground">{s.label}</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
