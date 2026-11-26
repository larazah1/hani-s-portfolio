import type { ReactNode } from "react";
import { usePreview, type PreviewItem } from "./LinkPreview";

/**
 * A card that opens its link in the preview overlay (click, Enter or Space);
 * a plain block when it has no link.
 */
export function PreviewCard({
  item,
  className,
  children,
}: {
  item: PreviewItem | null;
  className?: string;
  children: ReactNode;
}) {
  const open = usePreview();
  if (!item) return <div className={className}>{children}</div>;
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={item.title}
      onClick={() => open(item)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open(item);
        }
      }}
      className={`${className ?? ""} cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring`}
    >
      {children}
    </div>
  );
}
