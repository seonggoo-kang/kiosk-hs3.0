"use client"

import { useRef, useCallback } from "react"
import { cn } from "@/lib/utils"

type SubcategoryFilterProps = {
  items: Array<{ id: string; name: string }>
  activeId: string
  onSelect: (id: string) => void
}

export function SubcategoryFilter({ items, activeId, onSelect }: SubcategoryFilterProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  const moved = useRef(false)

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const el = scrollRef.current
    if (!el) return
    dragging.current = true
    moved.current = false
    startX.current = e.clientX
    scrollLeft.current = el.scrollLeft
    el.setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current || !scrollRef.current) return
    const dx = e.clientX - startX.current
    if (Math.abs(dx) > 3) moved.current = true
    scrollRef.current.scrollLeft = scrollLeft.current - dx
  }, [])

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    dragging.current = false
    scrollRef.current?.releasePointerCapture(e.pointerId)
  }, [])

  const handleClick = useCallback(
    (id: string) => {
      if (!moved.current) onSelect(id)
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
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => handleClick(item.id)}
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
