import type { MouseEvent } from "react";

const INTERACTIVE =
  'a, button, input, select, textarea, label, [role="button"], [role="switch"], [role="checkbox"], [role="menuitem"], [data-no-row-click]';

/** Classes for a row that opens on click. */
export const rowClickClass = "cursor-pointer transition-colors hover:bg-secondary/40";

/**
 * onClick handler that makes a whole list/table row open its edit view.
 * Clicks on the row's own buttons/links/inputs, and drag-to-select text,
 * are ignored so those keep working as before.
 */
export function onRowClick(open: () => void) {
  return (e: MouseEvent<HTMLElement>) => {
    const hit = (e.target as HTMLElement).closest(INTERACTIVE);
    if (hit && e.currentTarget.contains(hit)) return;
    if (window.getSelection()?.toString()) return;
    open();
  };
}
