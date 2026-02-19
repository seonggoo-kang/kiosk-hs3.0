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
      {/* 2-row grid: 6 columns per row, all 12 categories visible */}
      <div className="grid grid-cols-6 grid-rows-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={cn(
              "flex h-10 items-center justify-center border-b-2 px-1 text-center text-[10px] font-medium leading-tight transition-colors",
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
