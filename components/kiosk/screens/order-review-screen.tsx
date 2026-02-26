"use client"

import { useRef } from "react"
import { X, Minus, Plus } from "lucide-react"
import Image from "next/image"
import { ProgressStepper } from "@/components/kiosk/progress-stepper"
import { KioskFooter } from "@/components/kiosk/kiosk-footer"
import { useOrder, type CartItem } from "@/lib/order-context"
import { formatPrice, flavors as allFlavors } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface OrderReviewScreenProps {
  onBack: () => void
  onGoToDiscounts: () => void
  onHome: () => void
  onGoToMenu?: () => void
  onEditOptions?: (item: CartItem) => void
  currentStep: 1 | 2 | 3 | 4 | 5
  elapsedSeconds: number
}

export function OrderReviewScreen({
  onBack,
  onGoToDiscounts,
  onHome,
  onGoToMenu,
  onEditOptions,
  currentStep,
  elapsedSeconds,
}: OrderReviewScreenProps) {
  const { state, dispatch, totalItems, subtotal } = useOrder()
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleQuantityChange = (cartId: string, newQty: number) => {
    if (newQty <= 0) {
      dispatch({ type: "REMOVE_FROM_CART", payload: cartId })
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { cartId, quantity: newQty } })
    }
  }

  const handleRemove = (cartId: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: cartId })
  }

  // Calculate item price including options
  const getItemPrice = (item: CartItem) => {
    const optionsCost = item.options.reduce((sum, o) => sum + o.option.priceAdd * o.quantity, 0)
    const reqOptsCost = (item.requiredSelections ?? []).reduce((sum, r) => sum + r.priceAdd, 0)
    return (item.product.price + optionsCost + reqOptsCost) * item.quantity
  }

  // Build options summary string
  const getOptionsString = (item: CartItem) => {
    const parts: string[] = []
    // Required selections
    item.requiredSelections?.forEach((r) => {
      parts.push(r.selectedOptionName)
    })
    // Optional add-ons with quantity
    item.options.forEach((o) => {
      if (o.quantity > 0) {
        parts.push(o.quantity > 1 ? `${o.option.name} x${o.quantity}` : o.option.name)
      }
    })
    return parts.join(" · ")
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-background">
      <ProgressStepper
        currentStep={currentStep}
        elapsedSeconds={elapsedSeconds}
        onHome={onHome}
        onGoToStep={(step) => {
          if (step === 2 && onGoToMenu) onGoToMenu()
        }}
      />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Section header */}
        <div className="shrink-0 px-4 pb-1.5 pt-3">
          <h2 className="text-sm font-bold text-foreground">상품</h2>
        </div>

        {/* Scrollable product list */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 pb-4 pt-1 scrollbar-kiosk">
          <div className="flex flex-col gap-4">
            {state.cart.map((item) => (
              <OrderItemCard
                key={item.cartId}
                item={item}
                itemPrice={getItemPrice(item)}
                optionsString={getOptionsString(item)}
                onQuantityChange={(qty) => handleQuantityChange(item.cartId, qty)}
                onRemove={() => handleRemove(item.cartId)}
                onEditOptions={onEditOptions ? () => onEditOptions(item) : undefined}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom summary bar */}
      <div className="shrink-0 border-t border-border bg-background px-4 pb-1 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-foreground">주문수량</span>
            <span className="flex h-6 min-w-[2.5rem] items-center justify-center rounded-full bg-primary px-2 text-xs font-bold text-primary-foreground">
              {totalItems}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-foreground">총 주문금액</span>
            <span className="text-lg font-bold text-primary">{formatPrice(subtotal)}</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="shrink-0 bg-panel px-screen pb-2 pt-2">
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex h-button flex-1 items-center justify-center rounded-xl bg-secondary text-sm font-bold text-secondary-foreground transition-colors active:opacity-80"
          >
            이전으로
          </button>
          <button
            onClick={onGoToDiscounts}
            disabled={state.cart.length === 0}
            className={cn(
              "flex h-button flex-1 items-center justify-center rounded-xl text-sm font-bold transition-colors active:opacity-80",
              state.cart.length === 0 ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"
            )}
          >
            할인/적립
          </button>
        </div>
      </div>

      <KioskFooter />
    </div>
  )
}

// ─── Order Item Card Component ─────────────────────────────────────
interface OrderItemCardProps {
  item: CartItem
  itemPrice: number
  optionsString: string
  onQuantityChange: (qty: number) => void
  onRemove: () => void
  onEditOptions?: () => void
}

function OrderItemCard({ item, itemPrice, optionsString, onQuantityChange, onRemove, onEditOptions }: OrderItemCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {/* Remove button */}
      <button
        onClick={onRemove}
        className="absolute right-2 top-2 z-[1] flex h-5 w-5 items-center justify-center rounded-full bg-foreground/80 text-white shadow-sm transition-colors active:opacity-80"
        aria-label="삭제"
      >
        <X className="h-2.5 w-2.5" />
      </button>

      <div className="flex gap-3 p-3.5 pb-2.5">
        {/* Product info */}
        <div className="flex flex-1 flex-col gap-1 pr-16">
          <h3 className="text-sm font-bold leading-tight text-foreground">{item.product.name.replace(/\\n/g, " ")}</h3>
          {optionsString && (
            <p className="text-[10px] leading-relaxed text-muted-foreground">{optionsString}</p>
          )}
          {/* Flavor pills */}
          {item.selectedFlavors.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {item.selectedFlavors.map((flavor, idx) => {
                const flavorData = allFlavors.find((f) => f.id === flavor.id)
                return (
                  <div
                    key={`${flavor.id}-${idx}`}
                    className="flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2 py-0.5"
                  >
                    {flavorData?.image && (
                      <div className="relative h-4 w-4 shrink-0 overflow-hidden rounded-full">
                        <Image
                          src={flavorData.image}
                          alt={flavor.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <span className="text-[9px] font-medium text-foreground">{flavor.name}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Product image */}
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={item.product.image}
            alt={item.product.name}
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="mx-3.5 border-t border-border" />

      {/* Bottom row: quantity + options button + price */}
      <div className="flex items-center justify-between px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          {/* Quantity stepper */}
          <div className="flex items-center overflow-hidden rounded-full border border-border bg-background">
            <button
              onClick={() => onQuantityChange(item.quantity - 1)}
              className="flex h-7 w-8 items-center justify-center transition-colors active:bg-muted"
              aria-label="수량 감소"
            >
              <Minus className="h-3 w-3 text-muted-foreground" />
            </button>
            <span className="w-8 text-center text-xs font-bold text-primary">{item.quantity}</span>
            <button
              onClick={() => onQuantityChange(item.quantity + 1)}
              className="flex h-7 w-8 items-center justify-center transition-colors active:bg-muted"
              aria-label="수량 증가"
            >
              <Plus className="h-3 w-3 text-muted-foreground" />
            </button>
          </div>

          {/* Edit options button */}
          {onEditOptions && (
            <button
              onClick={onEditOptions}
              className="rounded-lg bg-primary px-3 py-1.5 text-[10px] font-bold text-primary-foreground transition-colors active:bg-primary/90"
            >
              옵션변경
            </button>
          )}
        </div>

        {/* Price */}
        <span className="text-base font-bold text-primary">{formatPrice(itemPrice)}</span>
      </div>
    </div>
  )
}
