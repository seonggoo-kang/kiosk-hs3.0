"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Sparkles, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  getRecommendedSections,
  shuffleRecommendedSections,
  type RecommendedSection,
  type Product,
} from "@/lib/mock-data"
import { ProductCard } from "@/components/kiosk/product-card"

type RecommendedPanelProps = {
  selectedProductId: string | null
  onSelectProduct: (product: Product) => void
}

export function RecommendedPanel({ selectedProductId, onSelectProduct }: RecommendedPanelProps) {
  const [sections, setSections] = useState<RecommendedSection[]>([])
  const [activeFilter, setActiveFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const filterRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // ── Drag-to-scroll for filter bar ──
  const isDragging = useRef(false)
  const dragStartX = useRef(0)
  const dragStartScrollLeft = useRef(0)
  const dragTotalDx = useRef(0)

  const onFilterPointerDown = useCallback((e: React.PointerEvent) => {
    const el = filterRef.current
    if (!el) return
    isDragging.current = true
    dragTotalDx.current = 0
    dragStartX.current = e.clientX
    dragStartScrollLeft.current = el.scrollLeft
    el.setPointerCapture(e.pointerId)
  }, [])

  const onFilterPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current || !filterRef.current) return
    const dx = e.clientX - dragStartX.current
    dragTotalDx.current = dx
    filterRef.current.scrollLeft = dragStartScrollLeft.current - dx
  }, [])

  const onFilterPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return
      isDragging.current = false
      filterRef.current?.releasePointerCapture(e.pointerId)

      // If barely moved, treat as a tap
      if (Math.abs(dragTotalDx.current) < 5) {
        const target = document.elementFromPoint(e.clientX, e.clientY)
        const btn = target?.closest<HTMLButtonElement>("button[data-filter-id]")
        if (btn?.dataset.filterId) {
          handleFilterTap(btn.dataset.filterId)
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sections]
  )

  // Initial load
  useEffect(() => {
    setSections(getRecommendedSections())
    setLoading(false)
  }, [])

  // AI refresh
  const handleRefresh = useCallback(() => {
    setLoading(true)
    setTimeout(() => {
      setSections(shuffleRecommendedSections())
      setActiveFilter("all")
      setLoading(false)
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
    }, 800)
  }, [])

  // Filter tap -- scroll to the section
  const handleFilterTap = useCallback((catId: string) => {
    setActiveFilter(catId)
    if (catId === "all") {
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      const el = sectionRefs.current[catId]
      if (el && scrollRef.current) {
        const containerTop = scrollRef.current.getBoundingClientRect().top
        const elTop = el.getBoundingClientRect().top
        const offset = scrollRef.current.scrollTop + (elTop - containerTop)
        scrollRef.current.scrollTo({ top: offset, behavior: "smooth" })
      }
    }
  }, [])

  // Build filter items
  const filterItems = [
    { id: "all", name: "\uC804\uCCB4" },
    ...sections.map((s) => ({ id: s.categoryId, name: s.categoryName })),
  ]

  return (
    <div className="flex h-full flex-col">
      {/* Category filter bar -- swipeable */}
      <div
        ref={filterRef}
        className="flex w-full shrink-0 gap-1.5 overflow-x-auto border-b border-border bg-card px-3 py-2 scrollbar-hide select-none"
        onPointerDown={onFilterPointerDown}
        onPointerMove={onFilterPointerMove}
        onPointerUp={onFilterPointerUp}
        onPointerCancel={onFilterPointerUp}
      >
        {filterItems.map((item) => (
          <button
            key={item.id}
            data-filter-id={item.id}
            className={cn(
              "shrink-0 rounded-full px-3 py-1 text-[11px] font-medium transition-colors",
              activeFilter === item.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground active:bg-muted/80"
            )}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* Scrollable content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto bg-muted/30">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 pt-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-xs text-muted-foreground animate-pulse">
              {"\uCD94\uCC9C \uBA54\uB274\uB97C \uBD88\uB7EC\uC624\uB294 \uC911..."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 px-3 pb-4 pt-3">
            {/* AI refresh button */}
            <button
              onClick={handleRefresh}
              className="flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 transition-colors active:bg-primary/10"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold text-primary">
                {"\uC624\uB298\uC758 \uC870\uD569 \uCD94\uCC9C"}
              </span>
              <RotateCcw className="h-3 w-3 text-primary/60" />
            </button>

            {/* Sections */}
            {sections.map((section) => (
              <div
                key={section.categoryId}
                ref={(el) => { sectionRefs.current[section.categoryId] = el }}
              >
                {/* Section header */}
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="text-[13px] font-bold text-foreground">
                    {section.categoryName}
                  </h3>
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-[10px] text-muted-foreground">
                    {section.products.length}{"\uAC1C"}
                  </span>
                </div>

                {/* Product grid */}
                <div className="grid grid-cols-4 gap-2">
                  {section.products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isSelected={selectedProductId === product.id}
                      onSelect={onSelectProduct}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
