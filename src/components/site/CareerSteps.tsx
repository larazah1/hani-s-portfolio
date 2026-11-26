import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLanguage } from "@/lib/language";
import { MetaLine } from "./Section";

/**
 * Numbered process timeline (same pattern as the NARSYSS "How we work" steps):
 * dots on a line that fills as you scroll — across on desktop, down on phones.
 * Each dot fills when the line reaches it and the steps rise in once.
 * Visitors who prefer reduced motion see the finished state straight away.
 *
 * layout="side": any number of steps in one column filling downwards, with the
 * heading kept in view beside it on desktop (for the full career on About).
 */
export type CareerStep = {
  id: string;
  position: string;
  organization: string;
  start: string;
  end: string;
};

export function CareerSteps({
  title,
  steps,
  footer,
  layout = "row",
}: {
  title: string;
  steps: CareerStep[];
  footer?: ReactNode;
  layout?: "row" | "side";
}) {
  const { dir } = useLanguage();
  const listRef = useRef<HTMLOListElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const [animate, setAnimate] = useState(false);
  const [shown, setShown] = useState(false);
  const [lit, setLit] = useState(steps.length);

  // Opt into the animation only on the client, and only without reduced motion.
  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) setAnimate(true);
  }, []);

  // Measure only once the "is-animated" class is on: before that, CSS keeps the
  // line full, which would light every dot.
  useEffect(() => {
    const list = listRef.current;
    const bar = progressRef.current;
    if (!animate || !list || !bar) return;

    const dots = Array.from(list.querySelectorAll<HTMLElement>("[data-step-dot]"));
    const desktop = window.matchMedia("(min-width: 64rem)");
    let frame = 0;

    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const r = list.getBoundingClientRect();
      // Rise in once the section's top is 85% down the screen.
      const sectionTop = list.parentElement?.getBoundingClientRect().top ?? r.top;
      if (sectionTop < vh * 0.85) setShown(true);
      // Fill from when the list's top passes 75% of the screen until its bottom passes 55%.
      const start = vh * 0.75;
      const end = vh * 0.55;
      const p = Math.min(1, Math.max(0, (start - r.top) / (start - end + r.height)));
      const horizontal = desktop.matches && layout === "row";
      bar.style.transform = horizontal ? `scaleX(${p})` : `scaleY(${p})`;

      const b = bar.getBoundingClientRect();
      const rtl = document.documentElement.dir === "rtl";
      let count = 0;
      for (const dot of dots) {
        const d = dot.getBoundingClientRect();
        const mid = horizontal ? d.left + d.width / 2 : d.top + d.height / 2;
        const on = horizontal
          ? b.width > 0.5 && (rtl ? b.left <= mid : b.right >= mid)
          : b.height > 0.5 && b.bottom >= mid;
        if (on) count++;
      }
      setLit(count);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    desktop.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      desktop.removeEventListener("change", schedule);
      bar.style.transform = "";
    };
  }, [animate, dir, layout, steps.length]);

  const visible = !animate || shown;

  return (
    <section
      className={`mx-auto max-w-6xl px-5 py-20 md:py-28 ${layout === "side" ? "steps-side" : ""}`}
    >
      <div className="steps-wrap">
        <div className="steps-head">
          <div className={`steps-reveal ${visible ? "is-shown" : ""}`}>
            <h2 className="max-w-3xl text-3xl md:text-5xl">{title}</h2>
          </div>
          {footer && layout === "side" && <div className="mt-10 text-sm">{footer}</div>}
        </div>

        <ol
          ref={listRef}
          className={`steps-list ${animate ? "is-animated" : ""}`}
          style={{ "--steps": steps.length } as React.CSSProperties}
        >
          <span className="steps-line" aria-hidden />
          <span ref={progressRef} className="steps-progress" aria-hidden />
          {steps.map((s, i) => (
            <li key={s.id} className="steps-item">
              <span data-step-dot className={`steps-dot ${i < lit ? "is-on" : ""}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div
                className={`steps-reveal ${visible ? "is-shown" : ""}`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <h3 className="text-xl leading-snug md:text-[1.3rem]">{s.position}</h3>
                <MetaLine
                  parts={[s.organization, `${s.start} — ${s.end}`]}
                  className="mt-2 max-w-[34ch] text-[0.9375rem] text-muted-foreground"
                />
              </div>
            </li>
          ))}
        </ol>
      </div>
      {footer && layout === "row" && <div className="mt-12 text-sm">{footer}</div>}
    </section>
  );
}
