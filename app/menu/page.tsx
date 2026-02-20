"use client"

import { useState, useMemo, useEffect, useRef, Suspense } from "react"
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
import { categories, getProductsByCategory, cakeSubcategories, beverageSubcategories, dessertSubcategories, prepackSubcategories, partySubcategories, packableSubcategories, type Product } from "@/lib/mock-data"

const ITEMS_PER_PAGE = 16 // 4 cols x 4 rows

function MenuContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { state, dispatch } = useOrder()
  const [activeCategory, setActiveCategory] = useState(categories[3].id)
  const [page, setPage] = useState(0)
  const [showAddedToast, setShowAddedToast] = useState(false)
  const [cakeFilter, setCakeFilter] = useState("all")
  const [beverageFilter, setBeverageFilter] = useState("all")
  const [dessertFilter, setDessertFilter] = useState("all")
  const [prepackFilter, setPrepackFilter] = useState("all")
  const [partyFilter, setPartyFilter] = useState("all")
  const [packableFilter, setPackableFilter] = useState("all")
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const isSwiping = useRef(false)

  // Show "item added" toast when coming back from options
  const justAdded = searchParams.get("added") === "true"
  useEffect(() => {
    if (justAdded && state.cart.length > 0) {
      setShowAddedToast(true)
      // Clear the param from URL without navigation
      window.history.replaceState(null, "", "/menu")
      const timer = setTimeout(() => setShowAddedToast(false), 2500)
      return () => clearTimeout(timer)
    }
  }, [justAdded, state.cart.length])

  const isEvent = activeCategory === "event"
  const isCake = activeCategory === "icecream-cake"
  const isBeverage = activeCategory === "beverage"
  const isDessert = activeCategory === "dessert"
  const isPrepack = activeCategory === "prepack"
  const isParty = activeCategory === "party"
  const isPackable = activeCategory === "packable-icecream"

  const categoryProducts = useMemo(() => {
    if (isEvent) return []
    const all = getProductsByCategory(activeCategory)
    if (isCake && cakeFilter !== "all") {
      return all.filter((p) => p.subcategory === cakeFilter)
    }
    if (isBeverage && beverageFilter !== "all") {
      return all.filter((p) => p.subcategory === beverageFilter)
    }
    if (isDessert && dessertFilter !== "all") {
      return all.filter((p) => p.subcategory === dessertFilter)
    }
    if (isPrepack && prepackFilter !== "all") {
      return all.filter((p) => p.subcategory === prepackFilter)
    }
    if (isParty && partyFilter !== "all") {
      return all.filter((p) => p.subcategory === partyFilter)
    }
    if (isPackable && packableFilter !== "all") {
      return all.filter((p) => p.subcategory === packableFilter)
    }
    return all
  }, [activeCategory, isEvent, isCake, cakeFilter, isBeverage, beverageFilter, isDessert, dessertFilter, isPrepack, prepackFilter, isParty, partyFilter, isPackable, packableFilter])

  // Event category uses promo banners (no pagination), other categories use product grid
  const totalPages = isEvent ? 1 : Math.max(1, Math.ceil(categoryProducts.length / ITEMS_PER_PAGE))
  const currentProducts = categoryProducts.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  )

  const selectedProduct = state.selectedProductId
    ? categoryProducts.find((p) => p.id === state.selectedProductId) || null
    : null

  const hasCart = state.cart.length > 0

  const handleCategoryChange = (id: string) => {
    setActiveCategory(id)
    setPage(0)
    setCakeFilter("all")
    setBeverageFilter("all")
    setDessertFilter("all")
    setPrepackFilter("all")
    setPartyFilter("all")
    setPackableFilter("all")
    dispatch({ type: "SELECT_PRODUCT", payload: null })
  }

  /** Swipe left/right: pages within a category, then chain to next/prev category */
  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "left") {
      // Swipe left = go forward
      if (page < totalPages - 1) {
        setPage((p) => p + 1)
      } else {
        // Move to next category
        const catIdx = categories.findIndex((c) => c.id === activeCategory)
        if (catIdx < categories.length - 1) {
          const nextCat = categories[catIdx + 1].id
          setActiveCategory(nextCat)
          setPage(0)
          dispatch({ type: "SELECT_PRODUCT", payload: null })
        }
      }
    } else {
      // Swipe right = go back
      if (page > 0) {
        setPage((p) => p - 1)
      } else {
        // Move to previous category, land on its last page
        const catIdx = categories.findIndex((c) => c.id === activeCategory)
        if (catIdx > 0) {
          const prevCat = categories[catIdx - 1].id
          const prevProducts = getProductsByCategory(prevCat)
          const prevTotalPages = Math.max(1, Math.ceil(prevProducts.length / ITEMS_PER_PAGE))
          setActiveCategory(prevCat)
          setPage(prevTotalPages - 1)
          dispatch({ type: "SELECT_PRODUCT", payload: null })
        }
      }
    }
  }

  const handleProductSelect = (product: Product) => {
    if (state.selectedProductId === product.id) {
      // Double tap = go straight to flavor selection (or cart if no flavor needed)
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
  }

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

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <KioskHeader title="메뉴 선택" />
      <CategoryTabs
        categories={categories}
        activeId={activeCategory}
        onSelect={handleCategoryChange}
      />

      {/* Subcategory filter for cake category */}
      {isCake && (
        <SubcategoryFilter
          items={cakeSubcategories}
          activeId={cakeFilter}
          onSelect={(id) => {
            setCakeFilter(id)
            setPage(0)
          }}
        />
      )}

      {/* Subcategory filter for beverage category */}
      {isBeverage && (
        <SubcategoryFilter
          items={beverageSubcategories}
          activeId={beverageFilter}
          onSelect={(id) => {
            setBeverageFilter(id)
            setPage(0)
          }}
        />
      )}

      {/* Subcategory filter for dessert category */}
      {isDessert && (
        <SubcategoryFilter
          items={dessertSubcategories}
          activeId={dessertFilter}
          onSelect={(id) => {
            setDessertFilter(id)
            setPage(0)
          }}
        />
      )}

      {/* Subcategory filter for prepack category */}
      {isPrepack && (
        <SubcategoryFilter
          items={prepackSubcategories}
          activeId={prepackFilter}
          onSelect={(id) => {
            setPrepackFilter(id)
            setPage(0)
          }}
        />
      )}

      {/* Subcategory filter for party/merchandise category */}
      {isParty && (
        <SubcategoryFilter
          items={partySubcategories}
          activeId={partyFilter}
          onSelect={(id) => {
            setPartyFilter(id)
            setPage(0)
          }}
        />
      )}

      {/* Subcategory filter for packable icecream category */}
      {isPackable && (
        <SubcategoryFilter
          items={packableSubcategories}
          activeId={packableFilter}
          onSelect={(id) => {
            setPackableFilter(id)
            setPage(0)
          }}
        />
      )}

      {/* Content area -- event promos OR product grid */}
      {isEvent ? (
        /* ── Event category: full-width promo banners, vertically scrollable ── */
        <div
          className="relative flex-1 overflow-hidden bg-muted/40"
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX
            touchStartY.current = e.touches[0].clientY
            isSwiping.current = false
          }}
          onTouchEnd={(e) => {
            const dx = touchStartX.current - e.changedTouches[0].clientX
            const dy = touchStartY.current - e.changedTouches[0].clientY
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
              handleSwipe(dx > 0 ? "left" : "right")
            }
          }}
        >
          <div className="h-full overflow-y-auto overflow-x-hidden">
            <EventPromoBanners />
          </div>
          {/* Swipe edge hints */}
          {categories.findIndex((c) => c.id === activeCategory) > 0 && (
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-4 bg-gradient-to-r from-foreground/5 to-transparent" aria-hidden="true" />
          )}
          {categories.findIndex((c) => c.id === activeCategory) < categories.length - 1 && (
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-4 bg-gradient-to-l from-foreground/5 to-transparent" aria-hidden="true" />
          )}
        </div>
      ) : (
        /* ── Other categories: product grid with swipe pagination ── */
        <div className="relative flex-1 overflow-hidden bg-muted/40">
          {/* Scrollable product area */}
          <div
            className="h-full overflow-y-auto overflow-x-hidden"
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0].clientX
              touchStartY.current = e.touches[0].clientY
              isSwiping.current = false
            }}
            onTouchMove={(e) => {
              if (!isSwiping.current) {
                const dx = Math.abs(e.touches[0].clientX - touchStartX.current)
                const dy = Math.abs(e.touches[0].clientY - touchStartY.current)
                if (dx > 10 || dy > 10) {
                  isSwiping.current = true
                }
              }
            }}
            onTouchEnd={(e) => {
              const dx = touchStartX.current - e.changedTouches[0].clientX
              const dy = touchStartY.current - e.changedTouches[0].clientY
              if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
                handleSwipe(dx > 0 ? "left" : "right")
              }
            }}
          >
            <div className="flex min-h-full flex-col p-3">
              {currentProducts.length > 0 ? (
                <div className="grid grid-cols-4 gap-2">
                  {currentProducts.map((product, idx) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isSelected={state.selectedProductId === product.id}
                      onSelect={handleProductSelect}
                      priority={page === 0}
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

          {/* Fixed overlays -- positioned relative to the non-scrolling wrapper */}

          {/* Swipe edge hints */}
          {!(page === 0 && categories.findIndex((c) => c.id === activeCategory) === 0) && (
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-4 bg-gradient-to-r from-foreground/5 to-transparent" aria-hidden="true" />
          )}
          {!(page === totalPages - 1 && categories.findIndex((c) => c.id === activeCategory) === categories.length - 1) && (
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-4 bg-gradient-to-l from-foreground/5 to-transparent" aria-hidden="true" />
          )}

          {/* Page indicator (non-interactive) */}
          {totalPages > 1 && (
            <div className="pointer-events-none absolute bottom-2 left-0 right-0 z-10 flex items-center justify-center gap-1.5" aria-hidden="true">
              {Array.from({ length: totalPages }).map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === page ? "w-4 bg-primary" : "w-1.5 bg-border"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Toast notification when item was just added */}
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
      )}

      {/* Product detail panel -- only when a product is selected */}
      {selectedProduct && (
        <div className="shrink-0 border-t border-border bg-card p-3">
          <ProductDetailPanel product={selectedProduct} />
        </div>
      )}

      {/* Cart strip -- always shows if cart has items */}
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
