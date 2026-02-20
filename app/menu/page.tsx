"use client"

import { useState, useMemo, useEffect, useRef, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { IceCreamCone, Check } from "lucide-react"
import { KioskHeader } from "@/components/kiosk/kiosk-header"
import { KioskFooter } from "@/components/kiosk/kiosk-footer"
import { CategoryTabs } from "@/components/kiosk/category-tabs"
import { ProductCard } from "@/components/kiosk/product-card"
import { ProductDetailPanel } from "@/components/kiosk/product-detail-panel"
import { CartStrip } from "@/components/kiosk/cart-strip"
import { ActionBar } from "@/components/kiosk/action-bar"
import { EventPromoBanners } from "@/components/kiosk/event-promo-banners"
import { SubcategoryFilter } from "@/components/kiosk/subcategory-filter"
import { useOrder } from "@/lib/order-context"
import {
  categories,
  getProductsByCategory,
  cakeSubcategories,
  beverageSubcategories,
  dessertSubcategories,
  prepackSubcategories,
  partySubcategories,
  packableSubcategories,
  type Product,
} from "@/lib/mock-data"

const ITEMS_PER_PAGE = 16 // 4 cols x 4 rows

// ── Flat slide descriptor ──────────────────────────────────
type Slide = {
  categoryId: string
  pageIndex: number // page within the category (0-based)
  totalPages: number // total pages this category has
  products: Product[] // pre-sliced products for this page
  isEvent: boolean
}

// ── Slide renderer (pure presentational) ───────────────────
function SlideContent({
  slide,
  selectedProductId,
  onSelectProduct,
}: {
  slide: Slide
  selectedProductId: string | null
  onSelectProduct: (p: Product) => void
}) {
  if (slide.isEvent) {
    return (
      <div className="h-full overflow-y-auto overflow-x-hidden">
        <EventPromoBanners />
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden">
      <div className="flex min-h-full flex-col p-3">
        {slide.products.length > 0 ? (
          <div className="grid grid-cols-4 gap-2">
            {slide.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isSelected={selectedProductId === product.id}
                onSelect={onSelectProduct}
                priority={slide.pageIndex === 0}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
            <IceCreamCone className="h-12 w-12 opacity-30" />
            <p className="text-sm">이 카테고리에 상품이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function MenuContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { state, dispatch } = useOrder()

  // ── Subcategory filter states ──
  const [cakeFilter, setCakeFilter] = useState("all")
  const [beverageFilter, setBeverageFilter] = useState("all")
  const [dessertFilter, setDessertFilter] = useState("all")
  const [prepackFilter, setPrepackFilter] = useState("all")
  const [partyFilter, setPartyFilter] = useState("all")
  const [packableFilter, setPackableFilter] = useState("all")

  // ── Toast ──
  const [showAddedToast, setShowAddedToast] = useState(false)
  const justAdded = searchParams.get("added") === "true"
  useEffect(() => {
    if (justAdded && state.cart.length > 0) {
      setShowAddedToast(true)
      window.history.replaceState(null, "", "/menu")
      const timer = setTimeout(() => setShowAddedToast(false), 2500)
      return () => clearTimeout(timer)
    }
  }, [justAdded, state.cart.length])

  // ── Build flat slide array (unfiltered -- filters only affect display within a category) ──
  const flatSlides = useMemo<Slide[]>(() => {
    const slides: Slide[] = []
    for (const cat of categories) {
      if (cat.id === "event") {
        slides.push({
          categoryId: cat.id,
          pageIndex: 0,
          totalPages: 1,
          products: [],
          isEvent: true,
        })
      } else {
        const products = getProductsByCategory(cat.id)
        const totalPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE))
        for (let p = 0; p < totalPages; p++) {
          slides.push({
            categoryId: cat.id,
            pageIndex: p,
            totalPages,
            products: products.slice(p * ITEMS_PER_PAGE, (p + 1) * ITEMS_PER_PAGE),
            isEvent: false,
          })
        }
      }
    }
    return slides
  }, [])

  // ── Flat index state ──
  // Start at the first slide of 4th category (index 3, "workshop")
  const initialFlatIndex = useMemo(() => {
    const idx = flatSlides.findIndex((s) => s.categoryId === categories[3].id)
    return idx >= 0 ? idx : 0
  }, [flatSlides])

  const [flatIndex, setFlatIndex] = useState(initialFlatIndex)

  // Derive category and page from flat index
  const currentSlide = flatSlides[flatIndex]
  const activeCategory = currentSlide.categoryId
  const page = currentSlide.pageIndex
  const totalPagesForCategory = currentSlide.totalPages

  // ── Subcategory-filtered products for the active category ──
  const activeFilter = useMemo(() => {
    const filterMap: Record<string, string> = {
      "icecream-cake": cakeFilter,
      beverage: beverageFilter,
      dessert: dessertFilter,
      prepack: prepackFilter,
      party: partyFilter,
      "packable-icecream": packableFilter,
    }
    return filterMap[activeCategory] ?? "all"
  }, [activeCategory, cakeFilter, beverageFilter, dessertFilter, prepackFilter, partyFilter, packableFilter])

  // When a subcategory filter is active, re-paginate all matching products
  const filteredSlides = useMemo(() => {
    if (activeFilter === "all" || currentSlide.isEvent) return null
    const allCatProducts = getProductsByCategory(activeCategory)
    const filtered = allCatProducts.filter((p) => p.subcategory === activeFilter)
    const pages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
    const slides: Slide[] = []
    for (let p = 0; p < pages; p++) {
      slides.push({
        categoryId: activeCategory,
        pageIndex: p,
        totalPages: pages,
        products: filtered.slice(p * ITEMS_PER_PAGE, (p + 1) * ITEMS_PER_PAGE),
        isEvent: false,
      })
    }
    return slides
  }, [activeFilter, activeCategory, currentSlide.isEvent])

  // Track page within filtered view
  const [filteredPageIndex, setFilteredPageIndex] = useState(0)

  // Reset filtered page when filter changes
  useEffect(() => {
    setFilteredPageIndex(0)
  }, [activeFilter])

  // The slide to display: either from filtered set or the current flat slide
  const displaySlide = useMemo<Slide>(() => {
    if (filteredSlides && filteredSlides.length > 0) {
      const idx = Math.min(filteredPageIndex, filteredSlides.length - 1)
      return filteredSlides[idx]
    }
    if (filteredSlides && filteredSlides.length === 0) {
      return { categoryId: activeCategory, pageIndex: 0, totalPages: 1, products: [], isEvent: false }
    }
    return currentSlide
  }, [filteredSlides, filteredPageIndex, currentSlide, activeCategory])

  const selectedProduct = state.selectedProductId
    ? displaySlide.products.find((p) => p.id === state.selectedProductId) ||
      currentSlide.products.find((p) => p.id === state.selectedProductId) ||
      null
    : null
  console.log("[v0] selectedProduct resolution:", state.selectedProductId, "found:", selectedProduct?.name ?? "null", "displaySlide products:", displaySlide.products.length, "currentSlide products:", currentSlide.products.length)

  const hasCart = state.cart.length > 0

  // ── Category tab click: jump to first slide of that category ──
  const handleCategoryChange = useCallback(
    (id: string) => {
      const idx = flatSlides.findIndex((s) => s.categoryId === id && s.pageIndex === 0)
      if (idx >= 0) setFlatIndex(idx)
      setCakeFilter("all")
      setBeverageFilter("all")
      setDessertFilter("all")
      setPrepackFilter("all")
      setPartyFilter("all")
      setPackableFilter("all")
      dispatch({ type: "SELECT_PRODUCT", payload: null })
    },
    [flatSlides, dispatch]
  )

  // ── Subcategory filter change: jump to first slide of current category ──
  const jumpToFirstPageOfCategory = useCallback(() => {
    const idx = flatSlides.findIndex(
      (s) => s.categoryId === activeCategory && s.pageIndex === 0
    )
    if (idx >= 0) setFlatIndex(idx)
  }, [flatSlides, activeCategory])

  // ── Drag / swipe state ──
  const [dragOffset, setDragOffset] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const dragStartX = useRef(0)
  const dragStartY = useRef(0)
  const dragActive = useRef(false)
  const dragLocked = useRef<"horizontal" | "vertical" | null>(null)
  const dragOffsetRef = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const canGoLeft = flatIndex > 0
  const canGoRight = flatIndex < flatSlides.length - 1

  // ── Adjacent slides for rendering (must be before drag callbacks) ──
  const isFiltered = filteredSlides !== null
  const prevSlide = useMemo(() => {
    if (isFiltered) {
      return filteredPageIndex > 0 ? filteredSlides![filteredPageIndex - 1] : null
    }
    return canGoLeft ? flatSlides[flatIndex - 1] : null
  }, [isFiltered, filteredSlides, filteredPageIndex, canGoLeft, flatSlides, flatIndex])

  const nextSlide = useMemo(() => {
    if (isFiltered) {
      return filteredSlides && filteredPageIndex < filteredSlides.length - 1
        ? filteredSlides[filteredPageIndex + 1]
        : null
    }
    return canGoRight ? flatSlides[flatIndex + 1] : null
  }, [isFiltered, filteredSlides, filteredPageIndex, canGoRight, flatSlides, flatIndex])

  // Track whether a horizontal drag occurred (set in pointerMove, cleared on next pointerDown)
  const wasDragging = useRef(false)

  // Global pointerup fallback for when pointer leaves the container during drag
  useEffect(() => {
    const handleGlobalUp = () => {
      if (dragActive.current) {
        dragActive.current = false
        const dx = dragOffsetRef.current
        if (Math.abs(dx) > 0) {
          setIsAnimating(true)
          setDragOffset(0)
          setTimeout(() => setIsAnimating(false), 250)
        }
        dragOffsetRef.current = 0
      }
    }
    window.addEventListener("pointerup", handleGlobalUp)
    return () => window.removeEventListener("pointerup", handleGlobalUp)
  }, [])

  const onDragPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (isAnimating) return
      wasDragging.current = false
      dragStartX.current = e.clientX
      dragStartY.current = e.clientY
      dragActive.current = true
      dragLocked.current = null
      dragOffsetRef.current = 0
      setDragOffset(0)
    },
    [isAnimating]
  )

  const onDragPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragActive.current) return
    const dx = e.clientX - dragStartX.current
    const dy = e.clientY - dragStartY.current

    if (!dragLocked.current && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
      dragLocked.current = Math.abs(dx) > Math.abs(dy) ? "horizontal" : "vertical"
      if (dragLocked.current === "horizontal") {
        wasDragging.current = true
      }
    }
    if (dragLocked.current !== "horizontal") return

    // 1:1 tracking, rubber-band at edges
    let offset = dx
    const atLeftEdge = !prevSlide && dx > 0
    const atRightEdge = !nextSlide && dx < 0
    if (atLeftEdge || atRightEdge) {
      offset = dx * 0.2 // rubber-band
    }

    dragOffsetRef.current = offset
    setDragOffset(offset)
  }, [prevSlide, nextSlide])

  const onDragPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!dragActive.current) return
      dragActive.current = false

      const dx = dragOffsetRef.current
      const containerWidth = containerRef.current?.offsetWidth || 400
      const threshold = containerWidth * 0.2

      dragLocked.current = null

      const hasNext = nextSlide !== null
      const hasPrev = prevSlide !== null

      // Decide: commit swipe or snap back
      if (dx < -threshold && hasNext) {
        // Swipe left -> go to next slide
        setIsAnimating(true)
        setDragOffset(-containerWidth)
        setTimeout(() => {
          if (isFiltered) {
            setFilteredPageIndex((prev) => prev + 1)
          } else {
            setFlatIndex((prev) => prev + 1)
          }
          setDragOffset(0)
          setIsAnimating(false)
          dispatch({ type: "SELECT_PRODUCT", payload: null })
        }, 250)
      } else if (dx > threshold && hasPrev) {
        // Swipe right -> go to previous slide
        setIsAnimating(true)
        setDragOffset(containerWidth)
        setTimeout(() => {
          if (isFiltered) {
            setFilteredPageIndex((prev) => prev - 1)
          } else {
            setFlatIndex((prev) => prev - 1)
          }
          setDragOffset(0)
          setIsAnimating(false)
          dispatch({ type: "SELECT_PRODUCT", payload: null })
        }, 250)
      } else {
        // Snap back
        setIsAnimating(true)
        setDragOffset(0)
        setTimeout(() => setIsAnimating(false), 250)
      }

      dragOffsetRef.current = 0
    },
    [nextSlide, prevSlide, isFiltered, dispatch]
  )

  // ── Product interaction ──
  const handleProductSelect = useCallback(
    (product: Product) => {
      console.log("[v0] handleProductSelect called", product.id, product.name, "wasDragging:", wasDragging.current, "selectedProductId:", state.selectedProductId)
      // If a horizontal drag just happened, ignore the click
      if (wasDragging.current) {
        console.log("[v0] BLOCKED by wasDragging guard")
        wasDragging.current = false
        return
      }

      if (state.selectedProductId === product.id) {
        if (product.requiresFlavor) {
          router.push(`/menu/flavors?productId=${product.id}`)
        } else {
          dispatch({
            type: "ADD_TO_CART",
            payload: {
              cartId: `${product.id}-${Date.now()}`,
              product,
              selectedFlavors: [],
              options: [],
              quantity: 1,
            },
          })
        }
      } else {
        dispatch({ type: "SELECT_PRODUCT", payload: product.id })
      }
    },
    [state.selectedProductId, router, dispatch]
  )

  const handleFlavorSelect = () => {
    if (selectedProduct) {
      router.push(`/menu/flavors?productId=${selectedProduct.id}`)
    }
  }

  const handleAddSimple = () => {
    if (selectedProduct && !selectedProduct.requiresFlavor) {
      dispatch({
        type: "ADD_TO_CART",
        payload: {
          cartId: `${selectedProduct.id}-${Date.now()}`,
          product: selectedProduct,
          selectedFlavors: [],
          options: [],
          quantity: 1,
        },
      })
    }
  }

  // Category booleans for subcategory filter visibility
  const isCake = activeCategory === "icecream-cake"
  const isBeverage = activeCategory === "beverage"
  const isDessert = activeCategory === "dessert"
  const isPrepack = activeCategory === "prepack"
  const isParty = activeCategory === "party"
  const isPackable = activeCategory === "packable-icecream"

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <KioskHeader title="메뉴 선택" />
      <CategoryTabs
        categories={categories}
        activeId={activeCategory}
        onSelect={handleCategoryChange}
      />

      {/* Subcategory filters */}
      {isCake && (
        <SubcategoryFilter
          items={cakeSubcategories}
          activeId={cakeFilter}
          onSelect={(id) => {
            setCakeFilter(id)
            jumpToFirstPageOfCategory()
          }}
        />
      )}
      {isBeverage && (
        <SubcategoryFilter
          items={beverageSubcategories}
          activeId={beverageFilter}
          onSelect={(id) => {
            setBeverageFilter(id)
            jumpToFirstPageOfCategory()
          }}
        />
      )}
      {isDessert && (
        <SubcategoryFilter
          items={dessertSubcategories}
          activeId={dessertFilter}
          onSelect={(id) => {
            setDessertFilter(id)
            jumpToFirstPageOfCategory()
          }}
        />
      )}
      {isPrepack && (
        <SubcategoryFilter
          items={prepackSubcategories}
          activeId={prepackFilter}
          onSelect={(id) => {
            setPrepackFilter(id)
            jumpToFirstPageOfCategory()
          }}
        />
      )}
      {isParty && (
        <SubcategoryFilter
          items={partySubcategories}
          activeId={partyFilter}
          onSelect={(id) => {
            setPartyFilter(id)
            jumpToFirstPageOfCategory()
          }}
        />
      )}
      {isPackable && (
        <SubcategoryFilter
          items={packableSubcategories}
          activeId={packableFilter}
          onSelect={(id) => {
            setPackableFilter(id)
            jumpToFirstPageOfCategory()
          }}
        />
      )}

      {/* ── Carousel container ── */}
      <div
        ref={containerRef}
        className="relative flex-1 overflow-hidden bg-muted/40 select-none touch-pan-y"
        onPointerDown={onDragPointerDown}
        onPointerMove={onDragPointerMove}
        onPointerUp={onDragPointerUp}
        onPointerCancel={onDragPointerUp}
      >
        {/* Three-slide track */}
        <div className="relative h-full w-full">
          {/* Previous slide */}
          {prevSlide && (
            <div
              className="absolute inset-0"
              style={{
                transform: `translateX(calc(-100% + ${dragOffset}px))`,
                transition: isAnimating ? "transform 250ms ease-out" : "none",
              }}
            >
              <SlideContent
                slide={prevSlide}
                selectedProductId={null}
                onSelectProduct={() => {}}
              />
            </div>
          )}

          {/* Current slide */}
          <div
            className="absolute inset-0"
            style={{
              transform: dragOffset !== 0 ? `translateX(${dragOffset}px)` : undefined,
              transition: isAnimating ? "transform 250ms ease-out" : "none",
            }}
          >
            <SlideContent
              slide={displaySlide}
              selectedProductId={state.selectedProductId}
              onSelectProduct={handleProductSelect}
            />
          </div>

          {/* Next slide */}
          {nextSlide && (
            <div
              className="absolute inset-0"
              style={{
                transform: `translateX(calc(100% + ${dragOffset}px))`,
                transition: isAnimating ? "transform 250ms ease-out" : "none",
              }}
            >
              <SlideContent
                slide={nextSlide}
                selectedProductId={null}
                onSelectProduct={() => {}}
              />
            </div>
          )}
        </div>

        {/* Swipe edge hints */}
        {prevSlide && (
          <div
            className="pointer-events-none absolute left-0 top-0 z-10 h-full w-4 bg-gradient-to-r from-foreground/5 to-transparent"
            aria-hidden="true"
          />
        )}
        {nextSlide && (
          <div
            className="pointer-events-none absolute right-0 top-0 z-10 h-full w-4 bg-gradient-to-l from-foreground/5 to-transparent"
            aria-hidden="true"
          />
        )}

        {/* Page dots for current category */}
        {displaySlide.totalPages > 1 && (
          <div
            className="pointer-events-none absolute bottom-2 left-0 right-0 z-10 flex items-center justify-center gap-1.5"
            aria-hidden="true"
          >
            {Array.from({ length: displaySlide.totalPages }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === displaySlide.pageIndex ? "w-4 bg-primary" : "w-1.5 bg-border"
                }`}
              />
            ))}
          </div>
        )}

        {/* Toast notification */}
        {showAddedToast && (
          <div className="absolute left-1/2 top-4 z-20 -translate-x-1/2 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2 rounded-full bg-foreground px-5 py-3 shadow-lg">
              <Check className="h-4 w-4 text-primary-foreground" />
              <span className="text-sm font-semibold text-primary-foreground">
                상품이 담겼습니다
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Product detail panel */}
      {selectedProduct && (
        <div className="shrink-0 border-t border-border bg-card p-3">
          <ProductDetailPanel product={selectedProduct} />
        </div>
      )}

      {/* Cart strip */}
      <CartStrip />

      {/* Action Bar */}
      {selectedProduct ? (
        <ActionBar
          onBack={() => dispatch({ type: "SELECT_PRODUCT", payload: null })}
          backLabel="이전으로"
          primaryLabel={selectedProduct.requiresFlavor ? "맛 선택하기" : "담기"}
          primaryDisabled={false}
          onPrimary={() => {
            if (selectedProduct.requiresFlavor) {
              handleFlavorSelect()
            } else {
              handleAddSimple()
            }
          }}
        />
      ) : (
        <ActionBar
          onBack={() => {
            dispatch({ type: "RESET_ORDER" })
            router.push("/")
          }}
          backLabel="처음으로"
          primaryLabel="주문하기"
          primaryDisabled={!hasCart}
          onPrimary={() => router.push("/discounts")}
        />
      )}

      <KioskFooter />
    </div>
  )
}

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      }
    >
      <MenuContent />
    </Suspense>
  )
}
