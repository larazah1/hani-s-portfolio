import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type PickableItem = { id: string; label: string; sublabel?: string };

/**
 * Search-select-remove-reorder picker for a section's `config.itemIds`
 * (homepage carousels) — this is what backs "choose which publications
 * appear in the homepage carousel... reorder... save".
 */
export function ItemPicker({
  allItems,
  selectedIds,
  onChange,
  emptyStateHint,
}: {
  allItems: PickableItem[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  emptyStateHint?: string;
}) {
  const [open, setOpen] = useState(false);
  const selectedItems = selectedIds
    .map((id) => allItems.find((item) => item.id === id))
    .filter((item): item is PickableItem => Boolean(item));
  const availableItems = allItems.filter((item) => !selectedIds.includes(item.id));

  function moveItem(index: number, direction: -1 | 1) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= selectedIds.length) return;
    const next = selectedIds.slice();
    const moved = next.splice(index, 1)[0];
    if (!moved) return;
    next.splice(newIndex, 0, moved);
    onChange(next);
  }

  return (
    <div>
      {selectedItems.length === 0 ? (
        <p className="rounded-md border border-dashed border-border px-3 py-4 text-sm text-muted-foreground">
          {emptyStateHint ?? "لم يتم اختيار شيء — سيتم عرض العناصر المميزة افتراضيًا."}
        </p>
      ) : (
        <ul className="divide-y divide-border rounded-md border border-border">
          {selectedItems.map((item, index) => (
            <li key={item.id} className="flex items-center gap-2 px-3 py-2">
              <div className="flex flex-col">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveItem(index, -1)}
                  aria-label="تحريك للأعلى"
                  className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  disabled={index === selectedItems.length - 1}
                  onClick={() => moveItem(index, 1)}
                  aria-label="تحريك للأسفل"
                  className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{item.label}</p>
                {item.sublabel && (
                  <p className="truncate text-xs text-muted-foreground">{item.sublabel}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => onChange(selectedIds.filter((id) => id !== item.id))}
                aria-label="إزالة"
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" size="sm" className="mt-3">
            <Plus className="h-3.5 w-3.5" />
            إضافة عنصر
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <Command>
            <CommandInput placeholder="بحث…" />
            <CommandList>
              <CommandEmpty>لا توجد نتائج مطابقة.</CommandEmpty>
              <CommandGroup>
                {availableItems.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.label}
                    onSelect={() => {
                      onChange([...selectedIds, item.id]);
                      setOpen(false);
                    }}
                  >
                    <div className="min-w-0">
                      <p className="truncate">{item.label}</p>
                      {item.sublabel && (
                        <p className="truncate text-xs text-muted-foreground">{item.sublabel}</p>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
