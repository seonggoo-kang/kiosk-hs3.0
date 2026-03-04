"use client"

import { useOrder } from "@/lib/order-context"
import { formatPrice } from "@/lib/mock-data"
import { ShoppingBag, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LandscapeLayoutProps {
  children: React.ReactNode
  onGoToOrderReview?: () => void
  showCart?: boolean
}

/**
 * LandscapeLayout wraps the main content in a side-by-side layout for landscape tablets.
 * Left panel (70%): Main screen content
 * Right panel (30%): Persistent cart summary + action buttons
 */
export function LandscapeLayout({ children, onGoToOrderReview, showCart = true }: LandscapeLayoutProps) {
  const { state, dispatch, totalItems, subtotal, totalDiscount, finalAmount } = useOrder()
  const hasItems = state.cart.length > 0

  return (
    <div className="flex h-full w-full">
      {/* Left panel: Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {children}
      </div>

      {/* Right panel: Cart summary (only shown when showCart is true) */}
      {showCart && (
        <div className="flex w-[280px] flex-col border-l border-border bg-card">
          {/* Cart header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <span className="font-bold text-foreground">주문 내역</span>
            </div>
            {hasItems && (
              <button
                onClick={() => dispatch({ type: "CLEAR_CART" })}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Trash2 className="h-3 w-3" />
                전체삭제
              </button>
            )}
          </div>

          {/* Cart items */}
          <div className="flex-1 overflow-y-auto scrollbar-kiosk p-3">
            {!hasItems ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <ShoppingBag className="mb-2 h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">
                  장바구니가 비어있습니다
                </p>
                <p className="mt-1 text-xs text-muted-foreground/70">
                  메뉴를 선택해주세요
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {state.cart.map((item) => (
                  <div
                    key={item.cartId}
                    className="relative rounded-xl bg-muted/50 p-3"
                  >
                    {/* Remove button */}
                    <button
                      onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: item.cartId })}
                      className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-foreground/10 text-foreground/60 transition-colors hover:bg-destructive hover:text-white"
                      aria-label="삭제"
                    >
                      <span className="text-xs font-bold">×</span>
                    </button>

                    {/* Item info */}
                    <div className="pr-6">
                      <p className="text-sm font-semibold text-foreground line-clamp-1">
                        {item.product.name.replace(/\n/g, " ")}
                      </p>
                      
                      {/* Flavors */}
                      {item.selectedFlavors.length > 0 && (
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                          {item.selectedFlavors.map(f => f.name).join(", ")}
                        </p>
                      )}
                      
                      {/* Price and quantity */}
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm font-bold text-primary">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => dispatch({ type: "UPDATE_QUANTITY", payload: { cartId: item.cartId, quantity: Math.max(1, item.quantity - 1) } })}
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-muted/80"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="min-w-[20px] text-center text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => dispatch({ type: "UPDATE_QUANTITY", payload: { cartId: item.cartId, quantity: item.quantity + 1 } })}
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart footer with totals */}
          <div className="border-t border-border bg-panel p-4">
            {/* Order summary */}
            <div className="mb-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">주문수량</span>
                <span className="font-semibold">{totalItems}개</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">상품금액</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-primary">
                  <span>할인금액</span>
                  <span className="font-semibold">-{formatPrice(totalDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-2 text-base">
                <span className="font-bold">총 결제금액</span>
                <span className="font-extrabold text-primary">{formatPrice(finalAmount)}</span>
              </div>
            </div>

            {/* Action button */}
            <button
              onClick={onGoToOrderReview}
              disabled={!hasItems}
              className={cn(
                "w-full rounded-xl py-3 text-base font-bold transition-all",
                hasItems
                  ? "bg-primary text-primary-foreground active:scale-[0.98]"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              주문하기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
