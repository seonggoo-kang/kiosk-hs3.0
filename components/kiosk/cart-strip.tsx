"use client"

import { useRef, useCallback } from "react"
import { X } from "lucide-react"
import { useOrder, itemNeedsOptions } from "@/lib/order-context"
import { formatPrice } from "@/lib/mock-data"
import { QuantityControl } from "./quantity-control"

export function MiniCart() {
  const { state, dispatch, totalItems, subtotal } = useOrder()
  const hasItems = state.cart.length > 0

  // ── Drag-to-scroll for item list ──
  const scrollRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const dragStartX = useRef(0)
  const dragScrollLeft = useRef(0)
  const dragDx = useRef(0)

  const onPointerDown = useCallback((e: React.PointerEvent) => {
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
    e.stopPropagation()
    if (!isDragging.current || !scrollRef.current) return
    const dx = e.clientX - dragStartX.current
    dragDx.current = dx
    scrollRef.current.scrollLeft = dragScrollLeft.current - dx
  }, [])

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    e.stopPropagation()
    if (!isDragging.current) return
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
      <div className="bg-[#F6F6FA] px-4 pt-3 pb-3">
        {/* Summary row */}
        <div className="flex items-center justify-between pb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-foreground">
              {"\uC8FC\uBB38\uC218\uB7C9"}
            </span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-white">
              {totalItems}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[10px] text-muted-foreground">
              {"\uCD1D \uC8FC\uBB38\uAE08\uC561"}
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
                className="relative flex w-44 shrink-0 flex-col overflow-visible rounded-xl border border-border bg-white p-2.5"
              >
                {/* X close button */}
                <button
                  onClick={() =>
                    dispatch({ type: "REMOVE_FROM_CART", payload: item.cartId })
                  }
                  className="absolute -right-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#424242] text-white shadow"
                  aria-label="삭제"
                >
                  <X className="h-3 w-3" />
                </button>

                {/* Image + info rows */}
                <div className="flex items-start gap-2">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-100">
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
                      <button className="mt-0.5 rounded-md bg-primary px-2 py-0.5 text-[9px] font-semibold text-white active:opacity-80">
                        {"옵션 선택"}
                      </button>
                    ) : hasChosenOptions ? (
                      <button className="mt-0.5 flex items-center gap-0.5 rounded-md bg-primary/10 px-2 py-0.5 text-[9px] font-semibold text-primary active:opacity-80">
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
                    min={0}
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
