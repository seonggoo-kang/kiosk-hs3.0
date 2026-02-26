"use client"

import { useRef, useCallback, useEffect } from "react"
import { X } from "lucide-react"
import { useOrder, itemNeedsOptions } from "@/lib/order-context"
import { formatPrice } from "@/lib/mock-data"
import { QuantityControl } from "./quantity-control"

interface MiniCartProps {
  onEditItem?: (cartId: string) => void
}

export function MiniCart({ onEditItem }: MiniCartProps = {}) {
  const { state, dispatch, totalItems, subtotal } = useOrder()
  const hasItems = state.cart.length > 0

  // ── Drag-to-scroll for item list ──
  const scrollRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const dragStartX = useRef(0)
  const dragScrollLeft = useRef(0)
  const dragDx = useRef(0)

  // Auto-scroll to the last-touched item (newly added or quantity-incremented)
  const prevTouchedId = useRef<string | null>(null)
  useEffect(() => {
    const touchedId = state.lastTouchedCartId
    if (touchedId && touchedId !== prevTouchedId.current && scrollRef.current) {
      const idx = state.cart.findIndex((item) => item.cartId === touchedId)
      if (idx >= 0) {
        requestAnimationFrame(() => {
          const container = scrollRef.current
          if (!container) return
          const card = container.children[idx] as HTMLElement | undefined
          if (card) {
            const cardLeft = card.offsetLeft
            const cardWidth = card.offsetWidth
            const containerWidth = container.clientWidth
            // Center the card in view
            container.scrollTo({
              left: cardLeft - (containerWidth - cardWidth) / 2,
              behavior: "smooth",
            })
          }
        })
      }
    }
    prevTouchedId.current = touchedId
  }, [state.lastTouchedCartId, state.cart])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    // Don't capture pointer if user tapped a button or interactive element
    const target = e.target as HTMLElement
    if (target.closest("button")) return

    e.stopPropagation()
    const el = scrollRef.current
    if (!el) return
    isDragging.current = true
    dragDx.current = 0
    dragStartX.current = e.clientX
    dragScrollLeft.current = el.scrollLeft
    el.setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current || !scrollRef.current) return
    e.stopPropagation()
    const dx = e.clientX - dragStartX.current
    dragDx.current = dx
    scrollRef.current.scrollLeft = dragScrollLeft.current - dx
  }, [])

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return
    e.stopPropagation()
    isDragging.current = false
    scrollRef.current?.releasePointerCapture(e.pointerId)
  }, [])

  return (
    <div
      className="shrink-0 overflow-hidden transition-all duration-300 ease-out"
      style={{
        maxHeight: hasItems ? "220px" : "0px",
        opacity: hasItems ? 1 : 0,
      }}
    >
      <div className="bg-panel px-screen pt-3 pb-3">
        {/* Summary row */}
        <div className="flex items-center justify-between pb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-foreground">
              주문수량
            </span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-white">
              {totalItems}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[10px] text-muted-foreground">
              총 주문금액
            </span>
            <span className="text-base font-extrabold text-primary">
              {formatPrice(subtotal)}
            </span>
          </div>
        </div>

        {/* Scrollable mini item cards */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto overflow-y-visible pt-2 pb-1 scrollbar-hide select-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {state.cart.map((item) => {
            const optionsCost = item.options.reduce(
              (sum, o) => sum + o.option.priceAdd * o.quantity,
              0
            )
            const reqOptsCost = (item.requiredSelections ?? []).reduce(
              (sum, r) => sum + r.priceAdd,
              0
            )
            const itemPrice = (item.product.price + optionsCost + reqOptsCost) * item.quantity
            const isPending = itemNeedsOptions(item)

            // Build chosen options summary
            const chosenParts: string[] = []
            if (item.selectedFlavors.length > 0) {
              chosenParts.push(item.selectedFlavors.map((f) => f.name).join(", "))
            }
            if ((item.requiredSelections ?? []).length > 0) {
              chosenParts.push(item.requiredSelections.map((r) => r.selectedOptionName).join("/"))
            }
            if (item.options.length > 0) {
              chosenParts.push(item.options.map((o) => o.option.name).join(", "))
            }
            const hasChosenOptions = chosenParts.length > 0
            const chosenSummary = chosenParts.join(", ")

            // Description matching ProductCard format
            const descText =
              item.product.weight && item.product.weight !== "-" && !item.product.size.includes(item.product.weight)
                ? `${item.product.size} (${item.product.weight})`
                : item.product.size

            return (
              <div
                key={item.cartId}
                className="relative flex w-44 shrink-0 flex-col overflow-visible rounded-xl border border-border bg-card p-2.5"
              >
                {/* X close button */}
                <button
                  onClick={() =>
                    dispatch({ type: "REMOVE_FROM_CART", payload: item.cartId })
                  }
                  className="absolute -right-2 -top-2 z-[1] flex h-5 w-5 items-center justify-center rounded-full bg-foreground/80 text-white shadow"
                  aria-label="삭제"
                >
                  <X className="h-2.5 w-2.5" />
                </button>

                {/* Image + info rows */}
                <div className="flex items-start gap-2">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-10 w-10 object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    {/* Row 1: Item name */}
                    <p className="truncate text-[10px] font-semibold text-foreground">
                      {item.product.name}
                    </p>
                    {/* Row 2: Description (matching ProductCard) */}
                    <p className="truncate text-[9px] text-muted-foreground">
                      {descText}
                    </p>
                    {/* Row 3: Option select/change chip */}
                    {isPending ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); onEditItem?.(item.cartId) }}
                        className="mt-0.5 rounded-md bg-primary px-2 py-0.5 text-[9px] font-semibold text-white active:opacity-80"
                      >
                        {"옵션 선택"}
                      </button>
                    ) : hasChosenOptions ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); onEditItem?.(item.cartId) }}
                        className="mt-0.5 flex items-center gap-0.5 rounded-md bg-primary/10 px-2 py-0.5 text-[9px] font-semibold text-primary active:opacity-80"
                      >
                        <span className="max-w-[80px] truncate">{chosenSummary}</span>
                        <svg className="h-2.5 w-2.5 shrink-0 opacity-60" viewBox="0 0 12 12" fill="none"><path d="M4 3l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    ) : null}
                  </div>
                </div>

                {/* Price */}
                <p className="mt-1.5 text-[10px] font-bold text-primary">
                  {formatPrice(itemPrice)}
                </p>

                {/* Bottom: full-width quantity stepper */}
                <div className="mt-1.5 flex items-center justify-center">
                  <QuantityControl
                    value={item.quantity}
                    onChange={(qty) =>
                      dispatch({
                        type: "UPDATE_QUANTITY",
                        payload: { cartId: item.cartId, quantity: qty },
                      })
                    }
                    min={1}
                    size="sm"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
