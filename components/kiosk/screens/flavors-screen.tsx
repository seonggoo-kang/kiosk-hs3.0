"use client"

import { useState, useMemo, useCallback, useRef, useEffect } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { ProgressStepper } from "@/components/kiosk/progress-stepper"
import { KioskFooter } from "@/components/kiosk/kiosk-footer"
import { ActionBar } from "@/components/kiosk/action-bar"
import {
  products,
  flavorCategories,
  getFlavorsByCategory,
  formatPrice,
  type Flavor,
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const COLS = 4
const ROWS = 4
const PER_PAGE = COLS * ROWS

interface FlavorsScreenProps {
  productId: string | null
  onBack: () => void
  onComplete: (productId: string, flavors: Flavor[]) => void
  onHome: () => void
  currentStep: 1 | 2 | 3 | 4 | 5
  elapsedSeconds: number
}

export function FlavorsScreen({ productId, onBack, onComplete, onHome, currentStep, elapsedSeconds }: FlavorsScreenProps) {
  const product = useMemo(() => products.find((p) => p.id === productId), [productId])

  const [activeCategory, setActiveCategory] = useState("all")
  const [page, setPage] = useState(0)
  const [selectedFlavors, setSelectedFlavors] = useState<Flavor[]>([])
  const [focusedFlavor, setFocusedFlavor] = useState<Flavor | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)

  const maxFlavors = product?.maxFlavors ?? 5

  const filteredFlavors = useMemo(() => getFlavorsByCategory(activeCategory), [activeCategory])
  const totalPages = Math.ceil(filteredFlavors.length / PER_PAGE)

  // Build pages for the carousel (current, prev, next)
  const getPageFlavors = useCallback((p: number) => {
    return filteredFlavors.slice(p * PER_PAGE, (p + 1) * PER_PAGE)
  }, [filteredFlavors])

  const pageFlavors = getPageFlavors(page)
  const prevPageFlavors = page > 0 ? getPageFlavors(page - 1) : null
  const nextPageFlavors = page < totalPages - 1 ? getPageFlavors(page + 1) : null

  // Count how many times each flavor is selected
  const flavorCountMap = useMemo(() => {
    const map = new Map<string, number>()
    for (const f of selectedFlavors) {
      map.set(f.id, (map.get(f.id) ?? 0) + 1)
    }
    return map
  }, [selectedFlavors])

  // Add one more instance of this flavor (duplicates allowed)
  const addFlavor = useCallback((flavor: Flavor) => {
    setSelectedFlavors((prev) => {
      if (prev.length >= maxFlavors) return prev
      setFocusedFlavor(flavor)
      return [...prev, flavor]
    })
  }, [maxFlavors])

  // Remove one instance of this flavor (from the grid X button)
  const removeOneFlavor = useCallback((flavorId: string) => {
    setSelectedFlavors((prev) => {
      const idx = prev.findIndex((f) => f.id === flavorId)
      if (idx === -1) return prev
      setFocusedFlavor(null)
      return [...prev.slice(0, idx), ...prev.slice(idx + 1)]
    })
  }, [])

  // Remove a specific slot by index (from the bottom panel X button)
  const removeByIndex = useCallback((index: number) => {
    setSelectedFlavors((prev) => {
      if (index < 0 || index >= prev.length) return prev
      setFocusedFlavor(null)
      return [...prev.slice(0, index), ...prev.slice(index + 1)]
    })
  }, [])

  const handleCategoryChange = (catId: string) => { setActiveCategory(catId); setPage(0) }

  // ── Pointer-event-based drag/swipe system (mirrors MenuScreen) ──
  const dragStartX = useRef(0)
  const dragStartY = useRef(0)
  const dragActive = useRef(false)
  const dragLocked = useRef<"horizontal" | "vertical" | null>(null)
  const dragOffsetRef = useRef(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const wasDragging = useRef(false)

  // Global pointer-up safety net
  useEffect(() => {
    const handleGlobalUp = () => {
      if (dragActive.current) {
        dragActive.current = false
        const dx = dragOffsetRef.current
        if (Math.abs(dx) > 0) { setIsAnimating(true); setDragOffset(0); setTimeout(() => setIsAnimating(false), 250) }
        dragOffsetRef.current = 0
      }
    }
    window.addEventListener("pointerup", handleGlobalUp)
    return () => window.removeEventListener("pointerup", handleGlobalUp)
  }, [])

  const onDragPointerDown = useCallback((e: React.PointerEvent) => {
    if (isAnimating) return
    wasDragging.current = false
    dragStartX.current = e.clientX
    dragStartY.current = e.clientY
    dragActive.current = true
    dragLocked.current = null
    dragOffsetRef.current = 0
    setDragOffset(0)
  }, [isAnimating])

  const onDragPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragActive.current) return
    const dx = e.clientX - dragStartX.current
    const dy = e.clientY - dragStartY.current
    if (!dragLocked.current && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
      dragLocked.current = Math.abs(dx) > Math.abs(dy) ? "horizontal" : "vertical"
      if (dragLocked.current === "horizontal") wasDragging.current = true
    }
    if (dragLocked.current !== "horizontal") return
    let offset = dx
    // Rubber-band at edges
    if ((!prevPageFlavors && dx > 0) || (!nextPageFlavors && dx < 0)) offset = dx * 0.2
    dragOffsetRef.current = offset
    setDragOffset(offset)
  }, [prevPageFlavors, nextPageFlavors])

  const onDragPointerUp = useCallback(() => {
    if (!dragActive.current) return
    dragActive.current = false
    const dx = dragOffsetRef.current
    const containerWidth = containerRef.current?.offsetWidth || 400
    const threshold = containerWidth * 0.2
    dragLocked.current = null
    if (dx < -threshold && nextPageFlavors) {
      setIsAnimating(true)
      setDragOffset(-containerWidth)
      setTimeout(() => { setPage((p) => p + 1); setDragOffset(0); setIsAnimating(false) }, 250)
    } else if (dx > threshold && prevPageFlavors) {
      setIsAnimating(true)
      setDragOffset(containerWidth)
      setTimeout(() => { setPage((p) => p - 1); setDragOffset(0); setIsAnimating(false) }, 250)
    } else {
      setIsAnimating(true)
      setDragOffset(0)
      setTimeout(() => setIsAnimating(false), 250)
    }
    dragOffsetRef.current = 0
  }, [prevPageFlavors, nextPageFlavors])

  const handleComplete = () => {
    if (!product || selectedFlavors.length === 0) return
    onComplete(product.id, selectedFlavors)
  }

  if (!product) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">{"상품을 찾을 수 없습니다."}</p>
      </div>
    )
  }

  // Render a single page grid of flavors
  const renderFlavorGrid = (flavors: Flavor[], interactive: boolean) => (
    <div className="flex h-full flex-col p-2">
      <div className="grid flex-1 grid-cols-4 grid-rows-4 gap-1.5">
        {flavors.map((flavor) => {
          const count = flavorCountMap.get(flavor.id) ?? 0
          const isSelected = count > 0
          const isFull = selectedFlavors.length >= maxFlavors
          const isDisabled = !isSelected && isFull
          return (
            <div key={flavor.id} className="relative">
              {/* Count badge -- top-left */}
              {isSelected && count > 0 && (
                <span className="absolute left-0 top-0 z-20 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-0.5 text-[9px] font-bold text-white shadow-sm">
                  {count}
                </span>
              )}
              {/* Remove badge -- top-right */}
              {isSelected && interactive && (
                <button
                  onClick={(e) => { e.stopPropagation(); removeOneFlavor(flavor.id) }}
                  className="absolute right-0 top-0 z-20 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-foreground/70 text-white shadow-sm"
                  aria-label={`${flavor.name} 제거`}
                >
                  <X className="h-2.5 w-2.5" strokeWidth={3} />
                </button>
              )}
              <button
                onClick={() => { if (interactive && !wasDragging.current) addFlavor(flavor) }}
                disabled={!interactive || isFull}
                className={cn(
                  "relative flex h-full w-full flex-col items-center justify-center gap-1 rounded-lg border-2 bg-card transition-all",
                  interactive && !isFull && "active:scale-[0.97]",
                  isSelected ? "border-primary" : !isSelected && isFull ? "border-transparent opacity-35" : "border-transparent"
                )}
              >
                {flavor.badge && (
                  <span className={cn(
                    "absolute left-0.5 top-5 z-10 max-w-[90%] truncate rounded px-1 py-px text-[7px] font-bold leading-tight text-white",
                    flavor.badge === "NEW" ? "bg-red-500" : flavor.badge === "과일 섬유질 포함" ? "bg-pink-400" : "bg-primary"
                  )}>
                    {flavor.badge}
                  </span>
                )}
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
                  <Image src={flavor.image} alt={flavor.name} fill className="object-cover" sizes="56px" priority={page === 0} />
                </div>
                <span className="w-full px-0.5 text-center text-[9px] font-semibold leading-tight text-foreground">
                  {flavor.name}
                </span>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <ProgressStepper currentStep={currentStep} elapsedSeconds={elapsedSeconds} onHome={onHome} />

      {/* Category tabs */}
      <div className="shrink-0 border-b border-border bg-card">
        <div className="grid grid-cols-4">
          {flavorCategories.slice(0, 4).map((cat) => (
            <button key={cat.id} onClick={() => handleCategoryChange(cat.id)}
              className={cn("border-b-2 px-1 py-2 text-[11px] font-semibold transition-colors",
                activeCategory === cat.id ? "border-primary text-primary" : "border-transparent text-muted-foreground"
              )}>
              {cat.name}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-4">
          {flavorCategories.slice(4).map((cat) => (
            <button key={cat.id} onClick={() => handleCategoryChange(cat.id)}
              className={cn("border-b-2 px-1 py-2 text-[11px] font-semibold transition-colors",
                activeCategory === cat.id ? "border-primary text-primary" : "border-transparent text-muted-foreground"
              )}>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Carousel grid area */}
      <div
        ref={containerRef}
        className="relative flex-1 touch-pan-y overflow-hidden bg-muted/30"
        style={{ touchAction: "pan-y" }}
        onPointerDown={onDragPointerDown}
        onPointerMove={onDragPointerMove}
        onPointerUp={onDragPointerUp}
        onPointerCancel={onDragPointerUp}
      >
        <div className="relative h-full w-full">
          {/* Previous page (off-screen left) */}
          {prevPageFlavors && (
            <div
              className="absolute inset-0"
              style={{
                transform: `translateX(calc(-100% + ${dragOffset}px))`,
                transition: isAnimating ? "transform 250ms ease-out" : "none",
              }}
            >
              {renderFlavorGrid(prevPageFlavors, false)}
            </div>
          )}

          {/* Current page */}
          <div
            className="absolute inset-0"
            style={{
              transform: dragOffset !== 0 ? `translateX(${dragOffset}px)` : undefined,
              transition: isAnimating ? "transform 250ms ease-out" : "none",
            }}
          >
            {renderFlavorGrid(pageFlavors, true)}
          </div>

          {/* Next page (off-screen right) */}
          {nextPageFlavors && (
            <div
              className="absolute inset-0"
              style={{
                transform: `translateX(calc(100% + ${dragOffset}px))`,
                transition: isAnimating ? "transform 250ms ease-out" : "none",
              }}
            >
              {renderFlavorGrid(nextPageFlavors, false)}
            </div>
          )}
        </div>

        {/* Edge shadow hints (like MenuScreen) */}
        {prevPageFlavors && <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-4 bg-gradient-to-r from-foreground/5 to-transparent" aria-hidden="true" />}
        {nextPageFlavors && <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-4 bg-gradient-to-l from-foreground/5 to-transparent" aria-hidden="true" />}

        {/* Pagination dots */}
        {totalPages > 1 && (
          <div className="pointer-events-none absolute bottom-2 left-0 right-0 z-10 flex items-center justify-center gap-1.5" aria-hidden="true">
            {Array.from({ length: totalPages }).map((_, i) => (
              <span key={i} className={cn("h-1.5 rounded-full transition-all duration-300", i === page ? "w-4 bg-primary" : "w-1.5 bg-border")} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom selection panel */}
      <div className="relative shrink-0 border-t border-border px-2 pb-1.5 pt-2" style={{ backgroundColor: "#F6F6FA" }}>
        {/* Flavor description pill -- absolutely positioned above the panel so it never affects layout */}
        {focusedFlavor && (
          <div className="absolute bottom-full left-0 right-0 z-20 px-3 pb-1.5">
            <div className="rounded-full bg-pink-100 px-4 py-1.5 shadow-sm">
              <p className="text-center text-[10px] leading-relaxed text-foreground/70">{focusedFlavor.description}</p>
            </div>
          </div>
        )}
        <div className="flex items-stretch gap-1.5 overflow-x-auto scrollbar-hide" style={{ height: 100 }}>
          {/* Product thumbnail */}
          <div className="flex shrink-0 flex-col items-center justify-center rounded-2xl border border-border/50 px-1.5" style={{ width: 78 }}>
            <div className="relative mb-1 h-12 w-12 overflow-hidden rounded-lg">
              <Image src={product.image} alt={product.name} fill className="object-contain" sizes="48px" />
            </div>
            <p className="line-clamp-2 w-full text-center text-[8px] font-bold leading-tight text-foreground">{product.name}</p>
            <p className="text-center text-[7px] leading-tight text-muted-foreground">{product.size}</p>
            <p className="mt-0.5 text-[9px] font-bold text-primary">{formatPrice(product.price)}</p>
          </div>
          {/* Flavor slots */}
          {Array.from({ length: maxFlavors }).map((_, i) => {
            const flavor = selectedFlavors[i]
            if (flavor) {
              return (
                <div key={`slot-${i}`} className="relative flex shrink-0 flex-col items-center justify-center rounded-2xl bg-pink-50" style={{ width: 68 }}>
                  <button
                    onClick={() => removeByIndex(i)}
                    className="absolute right-0.5 top-0.5 z-10 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-foreground/70 text-white shadow-sm"
                    aria-label={`${flavor.name} 제거`}
                  >
                    <X className="h-2.5 w-2.5" strokeWidth={3} />
                  </button>
                  <div className="relative mb-1 h-11 w-11 overflow-hidden rounded-full ring-2 ring-primary/20">
                    <Image src={flavor.image} alt={flavor.name} fill className="object-cover" sizes="44px" />
                  </div>
                  <p className="line-clamp-2 w-full px-0.5 text-center text-[7px] font-semibold leading-tight text-foreground">{flavor.name}</p>
                </div>
              )
            }
            return (
              <div key={`empty-${i}`} className="flex shrink-0 flex-col items-center justify-center rounded-2xl" style={{ width: 68, backgroundColor: "#EDEDF2" }}>
                <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-full bg-muted">
                  <span className="text-base font-bold text-muted-foreground/40">{"?"}</span>
                </div>
                <p className="text-center text-[7px] text-muted-foreground/50">{"플레이버 " + (i + 1)}</p>
              </div>
            )
          })}
        </div>
      </div>

      <ActionBar onBack={onBack} backLabel="이전으로" primaryLabel="선택 완료" onPrimary={handleComplete} primaryDisabled={selectedFlavors.length === 0} />
      <KioskFooter />
    </div>
  )
}
