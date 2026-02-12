"use client"

import Image from "next/image"
import { X } from "lucide-react"
import { useOrder } from "@/lib/order-context"
import { formatPrice } from "@/lib/mock-data"
import { QuantityControl } from "./quantity-control"

export function CartStrip() {
  const { state, dispatch, totalItems, subtotal } = useOrder()

  if (state.cart.length === 0) return null

  return (
    <div className="shrink-0 border-t border-border bg-card">
      {/* Summary row */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-foreground">주문수량</span>
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-primary-foreground">
            {totalItems}
          </span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm text-muted-foreground">총 주문금액</span>
          <span className="text-xl font-extrabold text-primary">{formatPrice(subtotal)}</span>
        </div>
      </div>

      {/* Scrollable items */}
      <div className="flex gap-3 overflow-x-auto px-4 pb-3 scrollbar-hide">
        {state.cart.map((item) => (
          <div
            key={item.cartId}
            className="relative flex w-36 shrink-0 flex-col rounded-xl border border-border bg-card p-2.5"
          >
            <button
              onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: item.cartId })}
              className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-card shadow"
              aria-label="삭제"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            <div className="flex items-start gap-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted/30">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  width={36}
                  height={36}
                  className="h-9 w-9 object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-foreground">{item.product.name}</p>
                <p className="truncate text-[10px] text-muted-foreground">
                  {item.selectedFlavors.length > 0
                    ? item.selectedFlavors.map((f) => f.name).join(", ")
                    : item.product.size}
                </p>
              </div>
            </div>

            <p className="mt-1.5 text-xs font-bold text-primary">
              {formatPrice(item.product.price)}
            </p>

            <div className="mt-2 flex items-center justify-between">
              {item.product.requiresFlavor && (
                <button className="rounded-md bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                  옵션변경
                </button>
              )}
              <div className={item.product.requiresFlavor ? "" : "ml-auto"}>
                <QuantityControl
                  value={item.quantity}
                  onChange={(qty) =>
                    dispatch({ type: "UPDATE_QUANTITY", payload: { cartId: item.cartId, quantity: qty } })
                  }
                  min={0}
                  size="sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
