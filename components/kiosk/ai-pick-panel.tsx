"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { Sparkles, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  getRankedRecommendations,
  shuffleRankedRecommendations,
  getRecommendedFilterCategories,
  type Product,
} from "@/lib/mock-data"
import { ProductCard } from "@/components/kiosk/product-card"

type RecommendedPanelProps = {
  selectedProductId: string | null
  onSelectProduct: (product: Product) => void
}

export function RecommendedPanel({ selectedProductId, onSelectProduct }: RecommendedPanelProps) {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [activeFilter, setActiveFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const filterRef = useRef<HTMLDivElement>(null)

  const filterCategories = useMemo(() => getRecommendedFilterCategories(), [])

  // Filtered products
  const visibleProducts = useMemo(() => {
    if (activeFilter === "all") return allProducts
    return allProducts.filter((p) => p.categoryId === activeFilter)
  }, [allProducts, activeFilter])

  // ── Drag-to-scroll for filter bar ──
  const isDraggingFilter = useRef(false)
  const dragStartX = useRef(0)
  const dragStartScrollLeft = useRef(0)
  const dragTotalDx = useRef(0)

  const onFilterPointerDown = useCallback((e: React.PointerEvent) => {
    e.stopPropagation()
    const el = filterRef.current
    if (!el) return
    isDraggingFilter.current = true
    dragTotalDx.current = 0
    dragStartX.current = e.clientX
    dragStartScrollLeft.current = el.scrollLeft
    el.setPointerCapture(e.pointerId)
  }, [])

  const onFilterPointerMove = useCallback((e: React.PointerEvent) => {
    e.stopPropagation()
    if (!isDraggingFilter.current || !filterRef.current) return
    const dx = e.clientX - dragStartX.current
    dragTotalDx.current = dx
    filterRef.current.scrollLeft = dragStartScrollLeft.current - dx
  }, [])

  const onFilterPointerUp = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation()
      if (!isDraggingFilter.current) return
      isDraggingFilter.current = false
      filterRef.current?.releasePointerCapture(e.pointerId)

      if (Math.abs(dragTotalDx.current) < 5) {
        const target = document.elementFromPoint(e.clientX, e.clientY)
        const btn = target?.closest<HTMLButtonElement>("button[data-filter-id]")
        if (btn?.dataset.filterId) {
          setActiveFilter(btn.dataset.filterId)
          scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
        }
      }
    },
    []
  )

  // Initial load
  useEffect(() => {
    setAllProducts(getRankedRecommendations())
    setLoading(false)
  }, [])

  // AI refresh
  const handleRefresh = useCallback(() => {
    setLoading(true)
    setTimeout(() => {
      setAllProducts(shuffleRankedRecommendations())
      setActiveFilter("all")
      setLoading(false)
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
    }, 800)
  }, [])

  // Build filter items
  const filterItems = [
    { id: "all", name: "\uC804\uCCB4" },
    ...filterCategories.map((c) => ({ id: c.id, name: c.name })),
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
          <div className="px-3 pb-4 pt-3">
            {/* AI refresh button */}
            <button
              onClick={handleRefresh}
              className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 transition-colors active:bg-primary/10"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold text-primary">
                {"\uC624\uB298\uC758 \uC870\uD569 \uCD94\uCC9C"}
              </span>
              <RotateCcw className="h-3 w-3 text-primary/60" />
            </button>

            {/* Flat product grid -- ranked by purchase likelihood */}
            <div className="grid grid-cols-4 gap-2">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isSelected={selectedProductId === product.id}
                  onSelect={onSelectProduct}
                />
              ))}
            </div>

            {visibleProducts.length === 0 && (
              <p className="pt-10 text-center text-xs text-muted-foreground">
                {"\uD574\uB2F9 \uCE74\uD14C\uACE0\uB9AC\uC5D0 \uCD94\uCC9C \uC81C\uD488\uC774 \uC5C6\uC2B5\uB2C8\uB2E4"}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
