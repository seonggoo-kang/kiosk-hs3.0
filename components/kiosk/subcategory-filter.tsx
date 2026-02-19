"use client"

import { cn } from "@/lib/utils"

type SubcategoryFilterProps = {
  items: Array<{ id: string; name: string }>
  activeId: string
  onSelect: (id: string) => void
}

export function SubcategoryFilter({ items, activeId, onSelect }: SubcategoryFilterProps) {
  return (
    <div className="flex w-full max-w-full shrink-0 gap-1.5 overflow-x-auto overscroll-x-contain border-b border-border bg-card px-3 py-2 scrollbar-hide touch-pan-x">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={cn(
            "shrink-0 rounded-full px-3 py-1 text-[11px] font-medium transition-colors",
            activeId === item.id
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground active:bg-muted/80"
          )}
        >
          {item.name}
        </button>
      ))}
    </div>
  )
}
