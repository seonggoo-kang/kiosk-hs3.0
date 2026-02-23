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
      <div className="rounded-t-2xl bg-[#2a2a2a] px-4 pt-3 pb-3">
        {/* Summary row */}
        <div className="flex items-center justify-between pb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-white">
              {"\uC8FC\uBB38\uC218\uB7C9"}
            </span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-white">
              {totalItems}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[10px] text-gray-400">
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
          className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide select-none"
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

            // Build options summary text
            const optionParts: string[] = []
            if (item.selectedFlavors.length > 0) {
              optionParts.push(item.selectedFlavors.map((f) => f.name).join(", "))
            }
            if ((item.requiredSelections ?? []).length > 0) {
              optionParts.push(item.requiredSelections.map((r) => r.selectedOptionName).join("/"))
            }
            if (item.options.length > 0) {
              optionParts.push(item.options.map((o) => o.option.name).join(", "))
            }
            const optionSummary = optionParts.length > 0 ? optionParts.join(", ") : isPending ? "\uC635\uC158 \uBBF8\uC120\uD0DD" : item.product.size || ""

            return (
              <div
                key={item.cartId}
                className={`relative flex w-40 shrink-0 flex-col rounded-xl border p-2.5 ${
                  isPending
                    ? "border-amber-500/60 bg-[#3a3a3a]"
                    : "border-[#4a4a4a] bg-[#3a3a3a]"
                }`}
              >
                {/* Pending badge */}
                {isPending && (
                  <div className="absolute left-2 top-2 z-10 flex h-4 items-center rounded-full bg-amber-500 px-1.5">
                    <span className="text-[8px] font-bold text-white">{"\uC635\uC158\uD544\uC694"}</span>
                  </div>
                )}

                {/* X close button */}
                <button
                  onClick={() =>
                    dispatch({ type: "REMOVE_FROM_CART", payload: item.cartId })
                  }
                  className="absolute -right-1 -top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-gray-500 text-white shadow"
                  aria-label={"\uC0AD\uC81C"}
                >
                  <X className="h-3 w-3" />
                </button>

                {/* Product image + name + options */}
                <div className={`flex items-start gap-2 ${isPending ? "mt-3" : ""}`}>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-9 w-9 object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[10px] font-semibold text-white">
                      {item.product.name}
                    </p>
                    <p className={`truncate text-[9px] ${isPending ? "text-amber-400" : "text-gray-400"}`}>
                      {optionSummary}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <p className="mt-1.5 text-[10px] font-bold text-primary">
                  {formatPrice(itemPrice)}
                </p>

                {/* Bottom row: 옵션변경 + quantity */}
                <div className="mt-1.5 flex items-center justify-between">
                  <button
                    className={`rounded-md px-2 py-0.5 text-[9px] font-semibold text-white active:opacity-80 ${
                      isPending ? "bg-amber-500" : "bg-primary/90"
                    }`}
                  >
                    {"\uC635\uC158\uBCC0\uACBD"}
                  </button>
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
                    dark
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
