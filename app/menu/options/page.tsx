"use client"

import { useState, useMemo, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { X } from "lucide-react"
import { KioskHeader } from "@/components/kiosk/kiosk-header"
import { KioskFooter } from "@/components/kiosk/kiosk-footer"
import { ActionBar } from "@/components/kiosk/action-bar"
import { ProductDetailPanel } from "@/components/kiosk/product-detail-panel"
import { OptionSelector } from "@/components/kiosk/option-selector"
import { useOrder } from "@/lib/order-context"
import { products, flavors, optionGroups, type Flavor, type CartItemOption } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

function OptionsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { dispatch } = useOrder()

  const productId = searchParams.get("productId")
  const product = useMemo(
    () => products.find((p) => p.id === productId),
    [productId]
  )

  const [selectedFlavors, setSelectedFlavors] = useState<Flavor[]>([])
  const [optionState, setOptionState] = useState<Record<string, { selectedId: string | null; quantities: Record<string, number> }>>(() => {
    const init: Record<string, { selectedId: string | null; quantities: Record<string, number> }> = {}
    optionGroups.forEach((group) => {
      const quantities: Record<string, number> = {}
      group.options.forEach((opt) => {
        quantities[opt.id] = opt.defaultQty ?? 0
      })
      init[group.id] = { selectedId: group.options[0]?.id ?? null, quantities }
    })
    return init
  })

  const toggleFlavor = useCallback(
    (flavor: Flavor) => {
      setSelectedFlavors((prev) => {
        const exists = prev.find((f) => f.id === flavor.id)
        if (exists) return prev.filter((f) => f.id !== flavor.id)
        if (product && prev.length >= product.maxFlavors) return prev
        return [...prev, flavor]
      })
    },
    [product]
  )

  const handleOptionSelect = (groupId: string, optionId: string) => {
    setOptionState((prev) => ({
      ...prev,
      [groupId]: { ...prev[groupId], selectedId: optionId },
    }))
  }

  const handleOptionQuantity = (groupId: string, optionId: string, qty: number) => {
    setOptionState((prev) => ({
      ...prev,
      [groupId]: {
        ...prev[groupId],
        quantities: { ...prev[groupId].quantities, [optionId]: qty },
      },
    }))
  }

  const canAddToCart = product
    ? product.requiresFlavor ? selectedFlavors.length > 0 : true
    : false

  const handleAddToCart = () => {
    if (!product || !canAddToCart) return

    const cartOptions: CartItemOption[] = []
    optionGroups.forEach((group) => {
      const gs = optionState[group.id]
      if (!gs) return
      if (group.type === "single") {
        const opt = group.options.find((o) => o.id === gs.selectedId)
        if (opt && opt.id !== group.options[0]?.id) {
          cartOptions.push({
            groupId: group.id,
            groupName: group.name,
            option: opt,
            quantity: gs.quantities[opt.id] ?? 1,
          })
        }
      } else {
        group.options.forEach((opt) => {
          const qty = gs.quantities[opt.id] ?? 0
          if (qty > 0) {
            cartOptions.push({
              groupId: group.id,
              groupName: group.name,
              option: opt,
              quantity: qty,
            })
          }
        })
      }
    })

    dispatch({
      type: "ADD_TO_CART",
      payload: {
        cartId: `${product.id}-${Date.now()}`,
        product,
        selectedFlavors,
        options: cartOptions,
        quantity: 1,
      },
    })

    // Navigate forward to the menu with cart visible so user can add more or proceed
    router.push("/menu?added=true")
  }

  if (!product) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">상품을 찾을 수 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <KioskHeader title="옵션 선택" />

      {/* Scrollable options area */}
      <div className="flex-1 overflow-y-auto bg-muted/40">
        <div className="p-4">
          {/* Flavor selection */}
          {product.requiresFlavor && (
            <section className="mb-6">
              <h2 className="mb-2 text-base font-bold text-foreground">
                {product.maxFlavors}가지 맛
              </h2>

              {/* Selected flavors */}
              {selectedFlavors.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {selectedFlavors.map((f) => (
                    <span
                      key={f.id}
                      className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium"
                    >
                      <span
                        className="inline-block h-3 w-3 rounded-full"
                        style={{ backgroundColor: f.color }}
                      />
                      {f.name}
                      <button
                        onClick={() => toggleFlavor(f)}
                        className="ml-0.5 text-muted-foreground hover:text-foreground"
                        aria-label={`${f.name} 제거`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Flavor grid */}
              <div className="grid grid-cols-3 gap-2">
                {flavors.map((flavor) => {
                  const isSelected = selectedFlavors.some((f) => f.id === flavor.id)
                  const isDisabled =
                    !isSelected && selectedFlavors.length >= product.maxFlavors

                  return (
                    <button
                      key={flavor.id}
                      onClick={() => !isDisabled && toggleFlavor(flavor)}
                      disabled={isDisabled}
                      className={cn(
                        "flex items-center gap-2 rounded-xl border-2 p-2.5 text-left transition-all active:scale-[0.97]",
                        isSelected
                          ? "border-primary bg-accent"
                          : isDisabled
                          ? "border-border bg-muted opacity-50"
                          : "border-border bg-card"
                      )}
                    >
                      <span
                        className="inline-block h-5 w-5 shrink-0 rounded-full"
                        style={{ backgroundColor: flavor.color }}
                      />
                      <span className="text-[11px] font-medium leading-tight text-foreground">
                        {flavor.name}
                      </span>
                    </button>
                  )
                })}
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                {selectedFlavors.length}/{product.maxFlavors} 맛 선택됨
              </p>
            </section>
          )}

          {/* Option groups */}
          {optionGroups.map((group) => {
            const gs = optionState[group.id]
            return (
              <section key={group.id} className="mb-5">
                <h2 className="mb-2 text-base font-bold text-foreground">{group.name}</h2>
                <div className="grid grid-cols-3 gap-2">
                  {group.options.map((opt) => {
                    const isSelected =
                      group.type === "single"
                        ? gs?.selectedId === opt.id
                        : (gs?.quantities[opt.id] ?? 0) > 0

                    return (
                      <OptionSelector
                        key={opt.id}
                        name={opt.name}
                        priceAdd={opt.priceAdd}
                        isSelected={isSelected}
                        onSelect={() => {
                          if (group.type === "single") {
                            handleOptionSelect(group.id, opt.id)
                          } else {
                            const current = gs?.quantities[opt.id] ?? 0
                            if (current === 0) {
                              handleOptionQuantity(group.id, opt.id, 1)
                            }
                          }
                        }}
                        hasQuantity={opt.hasQuantity}
                        quantity={gs?.quantities[opt.id] ?? 0}
                        onQuantityChange={(qty) =>
                          handleOptionQuantity(group.id, opt.id, qty)
                        }
                        unit={opt.unit}
                      />
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      </div>

      {/* Product info panel */}
      <div className="shrink-0 border-t border-border bg-card p-3">
        <ProductDetailPanel product={product} />
      </div>

      {/* Action bar */}
      <ActionBar
        onBack={() => router.push("/menu")}
        primaryLabel="담기"
        onPrimary={handleAddToCart}
        primaryDisabled={!canAddToCart}
      />

      <KioskFooter />
    </div>
  )
}

export default function OptionsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      }
    >
      <OptionsContent />
    </Suspense>
  )
}
