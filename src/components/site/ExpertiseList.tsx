import { useEffect, useRef, useState } from "react";

/**
 * Areas of expertise, laid out like the NARSYSS "Why NARSYSS" list:
 * a sticky title on the left (5/12) and plain
 * divided rows on the right (7/12). While scrolling, the row nearest the
 * middle of the screen becomes active: its title grows and takes the brand
 * colour (scroll position only, not hover).
 */
export function ExpertiseList({
  title,
  items,
  className = "",
}: {
  title: string;
  items: string[];
  className?: string;
}) {
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    let queued = false;
    const update = () => {
      queued = false;
      const mid = window.innerHeight / 2;
      let best: number | null = null;
      let bestD = Infinity;
      Array.from(list.children).forEach((li, i) => {
        const r = li.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      setActive(best);
    };
    const queue = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    queue();
    return () => {
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
    };
  }, [items.length]);

  return (
    <section className={`mx-auto max-w-6xl px-5 py-16 md:py-20 ${className}`}>
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <h2 className="text-4xl leading-[1.05] text-balance sm:text-5xl lg:text-[3.5rem]">
              {title}
            </h2>
          </div>
        </div>

        <ol ref={listRef} className="border-t border-border lg:col-span-7">
          {items.map((r, i) => {
            const on = active === i;
            return (
              <li
                key={r}
                className="grid grid-cols-12 items-baseline gap-x-4 border-b border-border py-7 md:py-9"
              >
                <span
                  className={`col-span-2 font-mono text-xs tabular-nums transition-colors duration-500 md:col-span-1 ${
                    on ? "text-accent" : "text-muted-foreground"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`col-span-10 block origin-left text-2xl leading-[1.15] font-normal tracking-[-0.03em] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] rtl:origin-right md:col-span-11 md:text-[2.1rem] ${
                    on ? "scale-[1.06] text-accent" : "text-foreground"
                  }`}
                >
                  {r}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
