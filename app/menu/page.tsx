"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { ChevronLeft, ChevronRight, IceCreamCone, Check } from "lucide-react"
import { KioskHeader } from "@/components/kiosk/kiosk-header"
import { KioskFooter } from "@/components/kiosk/kiosk-footer"
import { CategoryTabs } from "@/components/kiosk/category-tabs"
import { ProductCard } from "@/components/kiosk/product-card"
import { ProductDetailPanel } from "@/components/kiosk/product-detail-panel"
import { CartStrip } from "@/components/kiosk/cart-strip"
import { ActionBar } from "@/components/kiosk/action-bar"
import { useOrder } from "@/lib/order-context"
import { categories, getProductsByCategory, type Product } from "@/lib/mock-data"

const ITEMS_PER_PAGE = 12

function MenuContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { state, dispatch } = useOrder()
  const [activeCategory, setActiveCategory] = useState(categories[3].id)
  const [page, setPage] = useState(0)
  const [showAddedToast, setShowAddedToast] = useState(false)

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

  const categoryProducts = useMemo(
    () => getProductsByCategory(activeCategory),
    [activeCategory]
  )

  const totalPages = Math.max(1, Math.ceil(categoryProducts.length / ITEMS_PER_PAGE))
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
    dispatch({ type: "SELECT_PRODUCT", payload: null })
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

      {/* Product Grid */}
      <div className="relative flex-1 overflow-hidden bg-muted/40">
        <div className="h-full overflow-y-auto p-3">
          {currentProducts.length > 0 ? (
            <div className="grid grid-cols-4 gap-2">
              {currentProducts.map((product, idx) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isSelected={state.selectedProductId === product.id}
                  onSelect={handleProductSelect}
                  priority={page === 0 && idx < 4}
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
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === page ? "bg-primary" : "bg-border"
                }`}
                aria-label={`페이지 ${i + 1}`}
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

      {/* Bottom area: Product detail OR Promo banner OR nothing (just cart) */}
      {selectedProduct && (
        <div className="shrink-0 border-t border-border bg-card p-3">
          <ProductDetailPanel product={selectedProduct} />
        </div>
      )}

      {!selectedProduct && !hasCart && (
        <div className="shrink-0 border-t border-border bg-card p-3">
          <div className="relative h-28 overflow-hidden rounded-xl">
            <Image
              src="/promo-banner.jpg"
              alt="BERRY GOOD - Seasonal Strawberry Icecream"
              fill
              sizes="(max-width: 768px) 100vw, 480px"
              priority
              className="object-cover"
            />
          </div>
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
