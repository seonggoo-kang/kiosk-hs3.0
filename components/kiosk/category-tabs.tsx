"use client"

import { cn } from "@/lib/utils"
import type { Category } from "@/lib/mock-data"

type CategoryTabsProps = {
  categories: Category[]
  activeId: string
  onSelect: (id: string) => void
  emptyCategoryIds?: Set<string>
}

export function CategoryTabs({ categories, activeId, onSelect, emptyCategoryIds }: CategoryTabsProps) {
  return (
    <div className="shrink-0 border-b border-border bg-card">
      {/* 2-row grid: 6 columns per row, all 12 categories visible */}
      <div className="grid grid-cols-6 grid-rows-2">
        {categories.map((cat) => {
          const isEmpty = emptyCategoryIds?.has(cat.id) ?? false
          const isActive = activeId === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={cn(
                "flex h-10 items-center justify-center border-b-2 px-1 text-center text-[10px] font-medium leading-tight transition-colors",
                isActive && !isEmpty && "border-primary bg-card font-bold text-primary",
                isActive && isEmpty && "border-primary/40 bg-card text-primary/40",
                !isActive && !isEmpty && "border-transparent text-muted-foreground active:text-foreground",
                !isActive && isEmpty && "border-transparent text-muted-foreground/40 opacity-40"
              )}
            >
              <span className="whitespace-pre-wrap">{cat.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
