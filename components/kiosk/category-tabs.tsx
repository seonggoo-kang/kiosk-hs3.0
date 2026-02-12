"use client"

import { cn } from "@/lib/utils"
import type { Category } from "@/lib/mock-data"

type CategoryTabsProps = {
  categories: Category[]
  activeId: string
  onSelect: (id: string) => void
}

export function CategoryTabs({ categories, activeId, onSelect }: CategoryTabsProps) {
  return (
    <div className="shrink-0 border-b border-border bg-card">
      <div className="grid grid-cols-6 gap-0">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={cn(
              "flex h-12 items-center justify-center border-b-2 px-1 text-center text-[11px] font-medium leading-tight transition-colors",
              activeId === cat.id
                ? "border-primary bg-card font-bold text-primary"
                : "border-transparent text-muted-foreground active:text-foreground"
            )}
          >
            <span className="whitespace-pre-wrap">{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
