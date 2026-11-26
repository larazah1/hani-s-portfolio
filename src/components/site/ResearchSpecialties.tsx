import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Plus } from "lucide-react";

export type ResearchSpecialtyItem = {
  id: string;
  title: string;
  /** Optional; the panel shows just the publications link without one. */
  description?: string | null;
};

/**
 * Research specialties: a title that stays pinned (sticky)
 * on large screens, beside an accordion list. The item whose header has
 * scrolled past ~45% of the screen opens automatically and the others close.
 * The open item switches to the deep navy "active" colours and its + turns
 * into ×. Clicking a header opens it straight away.
 */
export function ResearchSpecialties({
  title,
  linkLabel,
  items,
  className = "",
}: {
  title: string;
  linkLabel: string;
  items: ResearchSpecialtyItem[];
  className?: string;
}) {
  const [openIndex, setOpenIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    let queued = false;
    const update = () => {
      queued = false;
      // Use each item's top edge (not its centre) so opening/closing an item,
      // which changes heights, doesn't flip the choice back and forth.
      const line = window.innerHeight * 0.45;
      let next = 0;
      Array.from(list.children).forEach((el, i) => {
        if (el.getBoundingClientRect().top <= line) next = i;
      });
      setOpenIndex(next);
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
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <h2 className="text-4xl leading-[1.05] text-balance sm:text-5xl lg:text-[3.5rem]">
              {title}
            </h2>
          </div>
        </div>

        <div ref={listRef} className="space-y-2.5 lg:col-span-7">
          {items.map((r, i) => {
            const open = openIndex === i;
            return (
              <div
                key={r.id}
                className={`overflow-hidden rounded-[20px] border transition-colors duration-500 ${
                  open
                    ? "border-surface-deep bg-surface-deep text-surface-deep-foreground"
                    : "border-border bg-card text-foreground hover:border-foreground/25"
                }`}
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(i)}
                    aria-expanded={open}
                    aria-controls={`research-panel-${i}`}
                    id={`research-trigger-${i}`}
                    className="flex w-full items-center justify-between gap-5 px-6 py-5 text-start focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring sm:px-7"
                  >
                    <span className="text-base sm:text-lg">{r.title}</span>
                    <span
                      className={`flex size-8 shrink-0 items-center justify-center rounded-full transition-all duration-500 ${
                        open
                          ? "rotate-[135deg] bg-accent text-accent-foreground"
                          : "bg-muted text-foreground/70"
                      }`}
                    >
                      <Plus className="size-4" aria-hidden="true" />
                    </span>
                  </button>
                </h3>
                <div
                  id={`research-panel-${i}`}
                  role="region"
                  aria-labelledby={`research-trigger-${i}`}
                  className={`grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 sm:px-7">
                      {r.description && (
                        <p className="mb-5 max-w-2xl text-[0.9375rem] leading-relaxed text-surface-deep-foreground/65">
                          {r.description}
                        </p>
                      )}
                      <Link
                        to="/publications"
                        tabIndex={open ? undefined : -1}
                        className="group inline-flex items-center gap-1.5 text-sm text-accent underline-offset-4 hover:underline"
                      >
                        {linkLabel}
                        <ArrowUpRight
                          aria-hidden="true"
                          className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 rtl:-scale-x-100"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
