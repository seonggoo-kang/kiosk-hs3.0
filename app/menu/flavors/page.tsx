"use client"

import { useState, useMemo, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { ChevronLeft, ChevronRight, HelpCircle, X } from "lucide-react"
import { KioskHeader } from "@/components/kiosk/kiosk-header"
import { KioskFooter } from "@/components/kiosk/kiosk-footer"
import { ActionBar } from "@/components/kiosk/action-bar"
import {
  products,
  flavors,
  flavorCategories,
  getFlavorsByCategory,
  formatPrice,
  type Flavor,
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const FLAVORS_PER_PAGE = 12

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

  const maxFlavors = product?.maxFlavors ?? 5

  const filteredFlavors = useMemo(
    () => getFlavorsByCategory(activeCategory),
    [activeCategory]
  )

  const totalPages = Math.max(
    1,
    Math.ceil(filteredFlavors.length / FLAVORS_PER_PAGE)
  )
  const currentFlavors = filteredFlavors.slice(
    page * FLAVORS_PER_PAGE,
    (page + 1) * FLAVORS_PER_PAGE
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

  const handleComplete = () => {
    if (!product || selectedFlavors.length === 0) return
    // Encode selected flavor IDs as a search param so the options page can read them
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

      {/* Flavor category tabs */}
      <div className="shrink-0 border-b border-border bg-card">
        <div className="grid grid-cols-4">
          {flavorCategories.slice(0, 4).map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={cn(
                "border-b-2 px-1 py-2.5 text-xs font-semibold transition-colors",
                activeCategory === cat.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
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
                "border-b-2 px-1 py-2.5 text-xs font-semibold transition-colors",
                activeCategory === cat.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Flavor grid */}
      <div className="relative flex-1 overflow-hidden bg-muted/40">
        <div className="h-full overflow-y-auto p-3">
          <div className="grid grid-cols-4 gap-2">
            {currentFlavors.map((flavor) => {
              const isSelected = selectedFlavors.some(
                (f) => f.id === flavor.id
              )
              const isDisabled =
                !isSelected && selectedFlavors.length >= maxFlavors

              return (
                <button
                  key={flavor.id}
                  onClick={() => {
                    if (!isDisabled) {
                      toggleFlavor(flavor)
                    }
                  }}
                  disabled={isDisabled}
                  className={cn(
                    "relative flex flex-col items-center gap-1 rounded-xl border-2 bg-card p-2 pb-2.5 transition-all active:scale-[0.97]",
                    isSelected
                      ? "border-primary"
                      : isDisabled
                      ? "border-border opacity-40"
                      : "border-border"
                  )}
                >
                  {/* Badge */}
                  {flavor.badge && (
                    <span
                      className={cn(
                        "absolute left-1 top-1 z-10 rounded-md px-1.5 py-0.5 text-[9px] font-bold leading-tight text-primary-foreground",
                        flavor.badge === "이달의 맛" && "bg-primary",
                        flavor.badge === "1위" && "bg-primary",
                        flavor.badge === "2위" && "bg-primary",
                        flavor.badge === "3위" && "bg-primary",
                        flavor.badge === "NEW" && "bg-primary"
                      )}
                    >
                      {flavor.badge}
                    </span>
                  )}

                  {/* Scoop image */}
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={flavor.image}
                      alt={flavor.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>

                  {/* Name */}
                  <span className="line-clamp-2 text-center text-[10px] font-semibold leading-tight text-foreground">
                    {flavor.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Pagination arrows */}
        {totalPages > 1 && (
          <>
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="absolute left-0 top-1/2 z-10 flex h-10 w-6 -translate-y-1/2 items-center justify-center rounded-r-lg bg-card/80 shadow disabled:opacity-0"
              aria-label="이전 페이지"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="absolute right-0 top-1/2 z-10 flex h-10 w-6 -translate-y-1/2 items-center justify-center rounded-l-lg bg-card/80 shadow disabled:opacity-0"
              aria-label="다음 페이지"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        {/* Page dots */}
        {totalPages > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={cn(
                  "h-2 w-2 rounded-full transition-colors",
                  i === page ? "bg-primary" : "bg-border"
                )}
                aria-label={`페이지 ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Flavor description */}
      {focusedFlavor && (
        <div className="shrink-0 border-t border-border bg-accent/50 px-4 py-2.5">
          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            {focusedFlavor.description}
          </p>
        </div>
      )}

      {/* Bottom selection strip */}
      <div className="shrink-0 border-t border-border bg-card">
        <div className="flex gap-0 overflow-x-auto scrollbar-hide">
          {/* Product info (fixed) */}
          <div className="flex shrink-0 flex-col items-center border-r border-border p-2.5" style={{ width: 100 }}>
            <div className="relative mb-1 h-12 w-12 overflow-hidden rounded-lg">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain"
                sizes="48px"
              />
            </div>
            <p className="text-center text-[9px] font-bold leading-tight text-foreground">
              {product.name}
            </p>
            <p className="text-center text-[9px] leading-tight text-foreground">
              {product.size}
            </p>
            <p className="text-[10px] font-bold text-primary">
              {formatPrice(product.price)}
            </p>
          </div>

          {/* Selected flavors + empty slots */}
          <div className="flex flex-1 gap-0 overflow-x-auto scrollbar-hide">
            {Array.from({ length: maxFlavors }).map((_, i) => {
              const flavor = selectedFlavors[i]
              if (flavor) {
                return (
                  <div
                    key={flavor.id}
                    className="relative flex shrink-0 flex-col items-center border-r border-border p-2"
                    style={{ width: 80 }}
                  >
                    <button
                      onClick={() => toggleFlavor(flavor)}
                      className="absolute -right-0.5 -top-0.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-primary-foreground"
                      aria-label={`${flavor.name} 제거`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <div className="relative mb-1 h-10 w-10 overflow-hidden rounded-full">
                      <Image
                        src={flavor.image}
                        alt={flavor.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <p className="line-clamp-2 text-center text-[9px] font-medium leading-tight text-foreground">
                      {flavor.name}
                    </p>
                  </div>
                )
              }
              return (
                <div
                  key={`empty-${i}`}
                  className="flex shrink-0 flex-col items-center border-r border-border p-2"
                  style={{ width: 80 }}
                >
                  <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <HelpCircle className="h-5 w-5 text-muted-foreground/40" />
                  </div>
                  <p className="text-center text-[9px] text-muted-foreground">
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
