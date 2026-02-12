"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, IceCreamCone } from "lucide-react"
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

export default function MenuPage() {
  const router = useRouter()
  const { state, dispatch } = useOrder()
  const [activeCategory, setActiveCategory] = useState(categories[3].id) // default to 포장가능 아이스크림
  const [page, setPage] = useState(0)

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
    dispatch({
      type: "SELECT_PRODUCT",
      payload: state.selectedProductId === product.id ? null : product.id,
    })
  }

  const handleFlavorSelect = () => {
    if (selectedProduct) {
      router.push(`/menu/options?productId=${selectedProduct.id}`)
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
              {currentProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isSelected={state.selectedProductId === product.id}
                  onSelect={handleProductSelect}
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
      </div>

      {/* Product Detail / Promo area */}
      {selectedProduct ? (
        <div className="shrink-0 border-t border-border bg-card p-3">
          <ProductDetailPanel product={selectedProduct} />
        </div>
      ) : !hasCart ? (
        <div className="shrink-0 border-t border-border bg-card p-3">
          <div className="flex h-28 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-muted">
            <div className="text-center">
              <p className="text-lg font-extrabold text-primary">BERRY GOOD</p>
              <p className="text-xs text-muted-foreground">SEASONAL STRAWBERRY ICECREAM</p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Cart strip */}
      <CartStrip />

      {/* Action bar */}
      <ActionBar
        onBack={() => {
          if (selectedProduct) {
            dispatch({ type: "SELECT_PRODUCT", payload: null })
          } else {
            dispatch({ type: "RESET_ORDER" })
            router.push("/")
          }
        }}
        backLabel={selectedProduct ? "이전으로" : "처음으로"}
        primaryLabel={
          selectedProduct
            ? selectedProduct.requiresFlavor
              ? "맛 선택하기"
              : "담기"
            : "주문하기"
        }
        primaryDisabled={!selectedProduct && !hasCart}
        onPrimary={() => {
          if (selectedProduct) {
            if (selectedProduct.requiresFlavor) {
              handleFlavorSelect()
            } else {
              handleAddSimple()
            }
          } else if (hasCart) {
            router.push("/discounts")
          }
        }}
      />

      <KioskFooter />
    </div>
  )
}
