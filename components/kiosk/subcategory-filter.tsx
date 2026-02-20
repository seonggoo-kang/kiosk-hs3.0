"use client"

import { useRef, useCallback, useState, useEffect } from "react"
import { cn } from "@/lib/utils"

type SubcategoryFilterProps = {
  items: Array<{ id: string; name: string }>
  activeId: string
  onSelect: (id: string) => void
}

export function SubcategoryFilter({ items, activeId, onSelect }: SubcategoryFilterProps) {
  // Defer rendering Korean text until after hydration to prevent SSR streaming
  // from splitting multibyte UTF-8 characters at buffer boundaries
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])

  const scrollRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const startScrollLeft = useRef(0)
  const totalDx = useRef(0)

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const el = scrollRef.current
    if (!el) return
    isDragging.current = true
    totalDx.current = 0
    startX.current = e.clientX
    startScrollLeft.current = el.scrollLeft
    el.setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current || !scrollRef.current) return
    const dx = e.clientX - startX.current
    totalDx.current = dx
    scrollRef.current.scrollLeft = startScrollLeft.current - dx
  }, [])

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return
      isDragging.current = false
      scrollRef.current?.releasePointerCapture(e.pointerId)

      // If barely moved, treat as a tap - find the button under the pointer
      if (Math.abs(totalDx.current) < 5) {
        const target = document.elementFromPoint(e.clientX, e.clientY)
        const btn = target?.closest<HTMLButtonElement>("button[data-filter-id]")
        if (btn?.dataset.filterId) {
          onSelect(btn.dataset.filterId)
        }
      }
    },
    [onSelect]
  )

  return (
    <div
      ref={scrollRef}
      className="flex w-full shrink-0 gap-1.5 overflow-x-auto border-b border-border bg-card px-3 py-2 scrollbar-hide select-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {ready
        ? items.map((item) => (
            <button
              key={item.id}
              data-filter-id={item.id}
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-[11px] font-medium transition-colors",
                activeId === item.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground active:bg-muted/80"
              )}
            >
              {item.name}
            </button>
          ))
        : null}
    </div>
  )
}
