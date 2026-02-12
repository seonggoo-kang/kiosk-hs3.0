"use client"

import { useState, useMemo, useCallback, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { HelpCircle, X, ChevronLeft, ChevronRight } from "lucide-react"
import { KioskHeader } from "@/components/kiosk/kiosk-header"
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
const ROWS = 5
const PER_PAGE = COLS * ROWS

function FlavorsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get("productId")
  const product = useMemo(
    () => products.find((p) => p.id === productId),
    [productId]
  )

  const [activeCategory, setActiveCategory] = useState("all")
  const [page, setPage] = useState(0)
  const [selectedFlavors, setSelectedFlavors] = useState<Flavor[]>([])
  const [focusedFlavor, setFocusedFlavor] = useState<Flavor | null>(null)

  // Touch swipe handling
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const gridRef = useRef<HTMLDivElement>(null)

  const maxFlavors = product?.maxFlavors ?? 5

  const filteredFlavors = useMemo(
    () => getFlavorsByCategory(activeCategory),
    [activeCategory]
  )

  const totalPages = Math.ceil(filteredFlavors.length / PER_PAGE)
  const pageFlavors = filteredFlavors.slice(
    page * PER_PAGE,
    (page + 1) * PER_PAGE
  )

  const toggleFlavor = useCallback(
    (flavor: Flavor) => {
      setSelectedFlavors((prev) => {
        const exists = prev.find((f) => f.id === flavor.id)
        if (exists) {
          setFocusedFlavor(null)
          return prev.filter((f) => f.id !== flavor.id)
        }
        if (prev.length >= maxFlavors) return prev
        setFocusedFlavor(flavor)
        return [...prev, flavor]
      })
    },
    [maxFlavors]
  )

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId)
    setPage(0)
  }

  const goPage = (dir: number) => {
    setPage((p) => Math.max(0, Math.min(totalPages - 1, p + dir)))
  }

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 50) {
      goPage(diff > 0 ? 1 : -1)
    }
  }

  const handleComplete = () => {
    if (!product || selectedFlavors.length === 0) return
    const flavorIds = selectedFlavors.map((f) => f.id).join(",")
    router.push(
      `/menu/options?productId=${product.id}&flavors=${flavorIds}`
    )
  }

  if (!product) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">상품을 찾을 수 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <KioskHeader title="맛 선택" />

      {/* Flavor category tabs - 2 rows */}
      <div className="shrink-0 border-b border-border bg-card">
        <div className="grid grid-cols-4">
          {flavorCategories.slice(0, 4).map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={cn(
                "border-b-2 px-1 py-2 text-[11px] font-semibold transition-colors",
                activeCategory === cat.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-4">
          {flavorCategories.slice(4).map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={cn(
                "border-b-2 px-1 py-2 text-[11px] font-semibold transition-colors",
                activeCategory === cat.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Swipeable flavor grid */}
      <div className="relative flex-1 overflow-hidden bg-muted/30">
        {/* Left / Right arrows */}
        {page > 0 && (
          <button
            onClick={() => goPage(-1)}
            className="absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded-r-lg bg-card/80 py-4 pl-0.5 pr-1 shadow"
            aria-label="이전 페이지"
          >
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
        {page < totalPages - 1 && (
          <button
            onClick={() => goPage(1)}
            className="absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded-l-lg bg-card/80 py-4 pl-1 pr-0.5 shadow"
            aria-label="다음 페이지"
          >
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        )}

        {/* Grid with touch swipe */}
        <div
          ref={gridRef}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="flex h-full flex-col p-2"
        >
          <div className="grid flex-1 grid-cols-4 grid-rows-5 gap-1">
            {pageFlavors.map((flavor) => {
              const isSelected = selectedFlavors.some(
                (f) => f.id === flavor.id
              )
              const isDisabled =
                !isSelected && selectedFlavors.length >= maxFlavors

              return (
                <button
                  key={flavor.id}
                  onClick={() => {
                    if (!isDisabled) toggleFlavor(flavor)
                  }}
                  disabled={isDisabled}
                  className={cn(
                    "relative flex flex-col items-center justify-center gap-0.5 rounded-lg border-2 bg-card transition-all active:scale-[0.97]",
                    isSelected
                      ? "border-primary"
                      : isDisabled
                      ? "border-transparent opacity-35"
                      : "border-transparent"
                  )}
                >
                  {/* Badge */}
                  {flavor.badge && (
                    <span className="absolute left-0.5 top-0.5 z-10 rounded bg-primary px-1 py-px text-[7px] font-bold leading-tight text-primary-foreground">
                      {flavor.badge}
                    </span>
                  )}

                  {/* Scoop image */}
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={flavor.image}
                      alt={flavor.name}
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </div>

                  {/* Name */}
                  <span className="line-clamp-2 w-full px-0.5 text-center text-[8px] font-semibold leading-tight text-foreground">
                    {flavor.name}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Page dots */}
          {totalPages > 1 && (
            <div className="flex shrink-0 items-center justify-center gap-1.5 py-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === page
                      ? "w-4 bg-primary"
                      : "w-1.5 bg-muted-foreground/30"
                  )}
                  aria-label={`${i + 1} 페이지`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Flavor description bar */}
      {focusedFlavor && (
        <div className="shrink-0 border-t border-border bg-accent/50 px-4 py-1.5">
          <p className="text-center text-[10px] leading-relaxed text-muted-foreground">
            {focusedFlavor.description}
          </p>
        </div>
      )}

      {/* Bottom selection strip */}
      <div className="shrink-0 border-t border-border bg-card">
        <div className="flex overflow-x-auto scrollbar-hide">
          {/* Product info */}
          <div
            className="flex shrink-0 flex-col items-center border-r border-border p-1.5"
            style={{ width: 80 }}
          >
            <div className="relative mb-0.5 h-9 w-9 overflow-hidden rounded-lg">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain"
                sizes="36px"
              />
            </div>
            <p className="text-center text-[7px] font-bold leading-tight text-foreground">
              {product.name}
            </p>
            <p className="text-center text-[7px] leading-tight text-foreground">
              {product.size}
            </p>
            <p className="text-[8px] font-bold text-primary">
              {formatPrice(product.price)}
            </p>
          </div>

          {/* Selected flavors + empty slots */}
          <div className="flex flex-1 overflow-x-auto scrollbar-hide">
            {Array.from({ length: maxFlavors }).map((_, i) => {
              const flavor = selectedFlavors[i]
              if (flavor) {
                return (
                  <div
                    key={flavor.id}
                    className="relative flex shrink-0 flex-col items-center border-r border-border p-1.5"
                    style={{ width: 62 }}
                  >
                    <button
                      onClick={() => toggleFlavor(flavor)}
                      className="absolute -right-0.5 -top-0.5 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-primary-foreground"
                      aria-label={`${flavor.name} 제거`}
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                    <div className="relative mb-0.5 h-8 w-8 overflow-hidden rounded-full">
                      <Image
                        src={flavor.image}
                        alt={flavor.name}
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    </div>
                    <p className="line-clamp-2 w-full text-center text-[7px] font-medium leading-tight text-foreground">
                      {flavor.name}
                    </p>
                  </div>
                )
              }
              return (
                <div
                  key={`empty-${i}`}
                  className="flex shrink-0 flex-col items-center border-r border-border p-1.5"
                  style={{ width: 62 }}
                >
                  <div className="mb-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <HelpCircle className="h-3.5 w-3.5 text-muted-foreground/40" />
                  </div>
                  <p className="text-center text-[7px] text-muted-foreground">
                    {"플레이버 " + (i + 1)}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Action bar */}
      <ActionBar
        onBack={() => router.back()}
        backLabel="이전으로"
        primaryLabel="선택 완료"
        onPrimary={handleComplete}
        primaryDisabled={selectedFlavors.length === 0}
      />

      <KioskFooter />
    </div>
  )
}

export default function FlavorsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      }
    >
      <FlavorsContent />
    </Suspense>
  )
}
