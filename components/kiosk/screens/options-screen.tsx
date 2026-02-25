"use client"

import { useState, useMemo } from "react"
import { ProgressStepper } from "@/components/kiosk/progress-stepper"
import { KioskFooter } from "@/components/kiosk/kiosk-footer"
import { ActionBar } from "@/components/kiosk/action-bar"
import { ProductDetailPanel } from "@/components/kiosk/product-detail-panel"
import { OptionSelector } from "@/components/kiosk/option-selector"
import { useOrder } from "@/lib/order-context"
import { products, flavors as allFlavors, optionGroups, type Flavor, type CartItemOption } from "@/lib/mock-data"

interface OptionsScreenProps {
  productId: string | null
  flavorIds: string[]
  onBack: () => void
  onComplete: () => void
  onHome: () => void
  currentStep: 1 | 2 | 3 | 4 | 5
  elapsedSeconds: number
}

export function OptionsScreen({ productId, flavorIds, onBack, onComplete, onHome, currentStep, elapsedSeconds }: OptionsScreenProps) {
  const { dispatch } = useOrder()

  const product = useMemo(() => products.find((p) => p.id === productId), [productId])

  const selectedFlavors = useMemo<Flavor[]>(() => {
    return flavorIds.map((id) => allFlavors.find((f) => f.id === id)).filter((f): f is Flavor => f !== undefined)
  }, [flavorIds])

  const [optionState, setOptionState] = useState<Record<string, { selectedId: string | null; quantities: Record<string, number> }>>(() => {
    const init: Record<string, { selectedId: string | null; quantities: Record<string, number> }> = {}
    optionGroups.forEach((group) => {
      const quantities: Record<string, number> = {}
      group.options.forEach((opt) => { quantities[opt.id] = opt.defaultQty ?? 0 })
      init[group.id] = { selectedId: group.options[0]?.id ?? null, quantities }
    })
    return init
  })

  const handleOptionSelect = (groupId: string, optionId: string) => {
    setOptionState((prev) => ({ ...prev, [groupId]: { ...prev[groupId], selectedId: optionId } }))
  }

  const handleOptionQuantity = (groupId: string, optionId: string, qty: number) => {
    setOptionState((prev) => ({
      ...prev,
      [groupId]: { ...prev[groupId], quantities: { ...prev[groupId].quantities, [optionId]: qty } },
    }))
  }

  const canAddToCart = product ? (product.requiresFlavor ? selectedFlavors.length > 0 : true) : false

  const handleAddToCart = () => {
    if (!product || !canAddToCart) return

    const cartOptions: CartItemOption[] = []
    optionGroups.forEach((group) => {
      const gs = optionState[group.id]
      if (!gs) return
      if (group.type === "single") {
        const opt = group.options.find((o) => o.id === gs.selectedId)
        if (opt && opt.id !== group.options[0]?.id) {
          cartOptions.push({ groupId: group.id, groupName: group.name, option: opt, quantity: gs.quantities[opt.id] ?? 1 })
        }
      } else {
        group.options.forEach((opt) => {
          const qty = gs.quantities[opt.id] ?? 0
          if (qty > 0) cartOptions.push({ groupId: group.id, groupName: group.name, option: opt, quantity: qty })
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
        requiredSelections: [],
        quantity: 1,
      },
    })

    onComplete()
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
      <ProgressStepper currentStep={currentStep} elapsedSeconds={elapsedSeconds} onHome={onHome} />

      <div className="flex-1 overflow-y-auto bg-muted/40">
        <div className="p-4">
          {product.requiresFlavor && selectedFlavors.length > 0 && (
            <section className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-base font-bold text-foreground">선택한 맛 ({selectedFlavors.length}/{product.maxFlavors})</h2>
                <button onClick={onBack} className="text-xs font-semibold text-primary">맛 변경하기</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedFlavors.map((f) => (
                  <span key={f.id} className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium">
                    <span className="inline-block h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: f.color }} />
                    {f.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {optionGroups.map((group) => {
            const gs = optionState[group.id]
            return (
              <section key={group.id} className="mb-5">
                <h2 className="mb-2 text-base font-bold text-foreground">{group.name}</h2>
                <div className="grid grid-cols-3 gap-2">
                  {group.options.map((opt) => {
                    const isSelected = group.type === "single" ? gs?.selectedId === opt.id : (gs?.quantities[opt.id] ?? 0) > 0
                    return (
                      <OptionSelector
                        key={opt.id}
                        name={opt.name}
                        priceAdd={opt.priceAdd}
                        isSelected={isSelected}
                        onSelect={() => {
                          if (group.type === "single") handleOptionSelect(group.id, opt.id)
                          else { const current = gs?.quantities[opt.id] ?? 0; if (current === 0) handleOptionQuantity(group.id, opt.id, 1) }
                        }}
                        hasQuantity={opt.hasQuantity}
                        quantity={gs?.quantities[opt.id] ?? 0}
                        onQuantityChange={(qty) => handleOptionQuantity(group.id, opt.id, qty)}
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

      <div className="shrink-0 border-t border-border bg-card p-3">
        <ProductDetailPanel product={product} />
      </div>

      <ActionBar onBack={onBack} primaryLabel="담기" onPrimary={handleAddToCart} primaryDisabled={!canAddToCart} />
      <KioskFooter />
    </div>
  )
}
