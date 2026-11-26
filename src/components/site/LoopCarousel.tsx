import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/language";

/**
 * Centre-mode looping carousel: one full card in the middle, with half of the
 * neighbouring cards showing on each side (on laptops, a full card on each side
 * plus half of the next ones). Moves only when the visitor drags,
 * swipes or uses the arrows/keyboard. Tapping a side card brings it to the
 * centre; only the centre card's own click (e.g. opening a preview) goes through.
 * Follows the page direction (LTR/RTL).
 */
export function LoopCarousel({
  children,
  label,
  footer,
  wide = false,
  autoplay = false,
}: {
  children: ReactNode;
  label: string;
  /** Optional link shown next to the arrows. */
  footer?: ReactNode;
  /** Wider cards on laptops (one card plus half of each neighbour), for long text. */
  wide?: boolean;
  /** Moves to the next card on its own; pauses on hover, focus or touch. */
  autoplay?: boolean;
}) {
  const { dir, t } = useLanguage();
  const [viewportRef, api] = useEmblaCarousel({
    loop: true,
    align: "center",
    direction: dir,
    // Slower, eased glide between cards (Embla default is 25).
    duration: 45,
  });
  const [selected, setSelected] = useState(0);

  // Looping needs enough cards to fill both sides; repeat short lists.
  const items = Children.toArray(children).filter(isValidElement) as ReactElement[];
  const realCount = items.length;
  let slides = items;
  while (slides.length > 0 && slides.length < 8) slides = [...slides, ...items];
  slides = slides.map((el, i) => cloneElement(el, { key: `${String(el.key)}-${i}` }));

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect).on("reInit", onSelect);
    return () => {
      api.off("select", onSelect).off("reInit", onSelect);
    };
  }, [api]);

  // Re-measure when the language (and so the direction) changes.
  useEffect(() => {
    api?.reInit({ direction: dir });
  }, [api, dir]);

  const prev = useCallback(() => api?.scrollPrev(), [api]);
  const next = useCallback(() => api?.scrollNext(), [api]);

  // Autoplay, skipped for visitors who prefer reduced motion.
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (!autoplay || !api || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Wait a full interval after every move, including the visitor's own.
    let id = window.setTimeout(() => api.scrollNext(), 5000);
    const restart = () => {
      window.clearTimeout(id);
      id = window.setTimeout(() => api.scrollNext(), 5000);
    };
    api.on("select", restart);
    return () => {
      window.clearTimeout(id);
      api.off("select", restart);
    };
  }, [autoplay, api, paused]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const forward = dir === "rtl" ? "ArrowLeft" : "ArrowRight";
    const back = dir === "rtl" ? "ArrowRight" : "ArrowLeft";
    if (e.key === forward) {
      e.preventDefault();
      next();
    } else if (e.key === back) {
      e.preventDefault();
      prev();
    }
  };

  const arrow =
    "inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={onKeyDown}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="overflow-hidden" ref={viewportRef}>
        <div className="flex touch-pan-y">
          {slides.map((slide, i) => {
            const active = i === selected;
            const copy = i >= realCount;
            return (
              <div
                key={slide.key}
                role="group"
                aria-roledescription="slide"
                aria-hidden={copy || undefined}
                aria-current={active || undefined}
                className={`min-w-0 shrink-0 grow-0 px-2 md:px-3 ${wide ? "basis-[85%] sm:basis-[70%] lg:basis-1/2" : "basis-[72%] sm:basis-[60%] lg:basis-1/4"}`}
                onClickCapture={(e) => {
                  if (!active) {
                    // First tap on a side card brings it to the centre.
                    e.preventDefault();
                    e.stopPropagation();
                    api?.scrollTo(i);
                  }
                }}
              >
                <div className="h-full" inert={!active}>
                  {slide}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="text-sm">{footer}</div>
        <div className="flex gap-2">
          <button type="button" onClick={prev} aria-label={t("carouselPrev")} className={arrow}>
            <ChevronLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
          </button>
          <button type="button" onClick={next} aria-label={t("carouselNext")} className={arrow}>
            <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
