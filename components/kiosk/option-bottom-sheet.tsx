"use client"

import { useState, useMemo, useCallback, useEffect, useRef } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  type Product,
  type Flavor,
  requiredOptionGroups,
  optionGroups,
  formatPrice,
} from "@/lib/mock-data"
import type { ResolvedRequiredOption, CartItemOption } from "@/lib/order-context"
import { OptionSelector } from "./option-selector"

// ─── Types ────────────────────────────────────────────────
type OptionBottomSheetProps = {
  product: Product
  /** Pre-filled data when editing an existing cart item */
  initialFlavors?: Flavor[]
  initialRequiredSelections?: ResolvedRequiredOption[]
  initialOptions?: CartItemOption[]
  /** Called with completed selections */
  onConfirm: (data: {
    requiredSelections: ResolvedRequiredOption[]
    flavors: Flavor[]
    options: CartItemOption[]
  }) => void
  /** Called when the user taps the flavor picker CTA -- parent navigates to FlavorsScreen */
  onPickFlavors?: (currentSelections: {
    requiredSelections: ResolvedRequiredOption[]
  }) => void
  onClose: () => void
}

export function OptionBottomSheet({
  product,
  initialFlavors = [],
  initialRequiredSelections = [],
  initialOptions = [],
  onConfirm,
  onPickFlavors,
  onClose,
}: OptionBottomSheetProps) {
  // ── Required option state ──
  const reqGroups = useMemo(() => {
    return product.requiredOptions
      .map((def) => {
        const group = requiredOptionGroups.find((g) => g.id === def.groupId)
        if (!group) return null
        return { ...group, label: def.label }
      })
      .filter(Boolean) as (typeof requiredOptionGroups[number] & { label: string })[]
  }, [product.requiredOptions])

  const [reqSelections, setReqSelections] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    // Pre-fill from initial or default to first option
    reqGroups.forEach((g) => {
      const existing = initialRequiredSelections.find((s) => s.groupId === g.id)
      init[g.id] = existing ? existing.selectedOptionId : g.options[0]?.id ?? ""
    })
    return init
  })

  // ── Flavor state ──
  const [selectedFlavors, setSelectedFlavors] = useState<Flavor[]>(initialFlavors)

  // ── Optional add-on state (spoon, cooling, toppings) ──
  // Only show for categories that typically need them: cone-cup, packable-icecream
  const showOptionalAddons = ["cone-cup", "packable-icecream"].includes(product.categoryId)

  const [optionState, setOptionState] = useState<
    Record<string, { selectedId: string | null; quantities: Record<string, number> }>
  >(() => {
    const init: Record<string, { selectedId: string | null; quantities: Record<string, number> }> = {}
    if (!showOptionalAddons) return init
    optionGroups.forEach((group) => {
      const quantities: Record<string, number> = {}
      group.options.forEach((opt) => {
        // Check if there's an existing selection
        const existing = initialOptions.find((o) => o.option.id === opt.id)
        quantities[opt.id] = existing ? existing.quantity : (opt.defaultQty ?? 0)
      })
      const existingSel = initialOptions.find((o) => group.options.some((go) => go.id === o.option.id))
      init[group.id] = {
        selectedId: existingSel ? existingSel.option.id : group.options[0]?.id ?? null,
        quantities,
      }
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

  // ── Computed price ──
  const reqOptsCost = useMemo(() => {
    return reqGroups.reduce((sum, g) => {
      const sel = reqSelections[g.id]
      const opt = g.options.find((o) => o.id === sel)
      return sum + (opt?.priceAdd ?? 0)
    }, 0)
  }, [reqGroups, reqSelections])

  const addonsCost = useMemo(() => {
    if (!showOptionalAddons) return 0
    let cost = 0
    optionGroups.forEach((group) => {
      const gs = optionState[group.id]
      if (!gs) return
      if (group.type === "single") {
        const opt = group.options.find((o) => o.id === gs.selectedId)
        if (opt) cost += opt.priceAdd * (gs.quantities[opt.id] ?? 1)
      } else {
        group.options.forEach((opt) => {
          const qty = gs.quantities[opt.id] ?? 0
          if (qty > 0) cost += opt.priceAdd * qty
        })
      }
    })
    return cost
  }, [showOptionalAddons, optionState])

  const totalPrice = product.price + reqOptsCost + addonsCost

  // ── Validation: all required options selected, flavors if needed ──
  const allReqSelected = reqGroups.every((g) => reqSelections[g.id])
  const flavorsOk = !product.requiresFlavor || selectedFlavors.length > 0
  const canConfirm = allReqSelected && flavorsOk

  // ── Confirm handler ──
  const handleConfirm = useCallback(() => {
    if (!canConfirm) return

    const resolvedReq: ResolvedRequiredOption[] = reqGroups.map((g) => {
      const selId = reqSelections[g.id]
      const opt = g.options.find((o) => o.id === selId)!
      return {
        groupId: g.id,
        selectedOptionId: opt.id,
        selectedOptionName: opt.name,
        priceAdd: opt.priceAdd,
      }
    })

    const cartOptions: CartItemOption[] = []
    if (showOptionalAddons) {
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
    }

    onConfirm({
      requiredSelections: resolvedReq,
      flavors: selectedFlavors,
      options: cartOptions,
    })
  }, [canConfirm, reqGroups, reqSelections, selectedFlavors, showOptionalAddons, optionState, onConfirm])

  // ── Pick flavors handler ──
  const handlePickFlavors = useCallback(() => {
    if (!onPickFlavors) return
    const resolvedReq: ResolvedRequiredOption[] = reqGroups.map((g) => {
      const selId = reqSelections[g.id]
      const opt = g.options.find((o) => o.id === selId)!
      return {
        groupId: g.id,
        selectedOptionId: opt.id,
        selectedOptionName: opt.name,
        priceAdd: opt.priceAdd,
      }
    })
    onPickFlavors({ requiredSelections: resolvedReq })
  }, [onPickFlavors, reqGroups, reqSelections])

  // ── Slide-up animation ──
  const [visible, setVisible] = useState(false)
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  const handleClose = useCallback(() => {
    setVisible(false)
    setTimeout(onClose, 250)
  }, [onClose])

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col justify-end transition-colors duration-250",
        visible ? "bg-foreground/40" : "bg-transparent"
      )}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
      role="dialog"
      aria-modal="true"
      aria-label="옵션 선택"
    >
      <div
        ref={sheetRef}
        className={cn(
          "relative flex max-h-[85vh] flex-col rounded-t-2xl bg-card shadow-xl transition-transform duration-250 ease-out",
          visible ? "translate-y-0" : "translate-y-full"
        )}
      >
        {/* ── Header ── */}
        <div className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
            <Image src={product.image} alt={product.name} fill className="object-contain" sizes="48px" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-foreground">{product.name}</p>
            <p className="text-xs text-muted-foreground">{product.size}</p>
          </div>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-muted"
            aria-label="닫기"
          >
            <X className="h-4 w-4 text-foreground" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {/* Required option groups */}
          {reqGroups.map((group) => (
            <section key={group.id} className="mb-4">
              <h3 className="mb-2 text-xs font-bold text-foreground">{group.name}</h3>
              <div className="flex gap-2">
                {group.options.map((opt) => {
                  const isSelected = reqSelections[group.id] === opt.id
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setReqSelections((prev) => ({ ...prev, [group.id]: opt.id }))}
                      className={cn(
                        "flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl border-2 px-3 py-3 transition-all active:scale-[0.97]",
                        isSelected ? "border-primary bg-accent" : "border-border bg-card"
                      )}
                    >
                      <span className="text-sm font-semibold text-foreground">{opt.name}</span>
                      {opt.priceAdd > 0 && (
                        <span className="text-[10px] font-bold text-primary">+{formatPrice(opt.priceAdd)}</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </section>
          ))}

          {/* Flavor selection CTA */}
          {product.requiresFlavor && (
            <section className="mb-4">
              <h3 className="mb-2 text-xs font-bold text-foreground">
                {"맛 선택"} ({selectedFlavors.length}/{product.maxFlavors})
              </h3>
              {selectedFlavors.length > 0 ? (
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {selectedFlavors.map((f, idx) => (
                      <span key={`${f.id}-${idx}`} className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-accent px-2.5 py-1 text-[10px] font-medium text-foreground">
                        <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: f.color }} />
                        {f.name}
                      </span>
                    ))}
                  </div>
                  {onPickFlavors && (
                    <button
                      onClick={handlePickFlavors}
                      className="self-start rounded-lg border border-primary/30 px-3 py-1.5 text-xs font-semibold text-primary active:bg-accent"
                    >
                      {"맛 변경하기"}
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={handlePickFlavors}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/40 bg-accent/50 px-4 py-4 transition-all active:scale-[0.98]"
                >
                  <span className="text-sm font-semibold text-primary">{"맛 선택하기"}</span>
                  <svg className="h-4 w-4 text-primary" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              )}
            </section>
          )}

          {/* Optional add-ons (spoon, cooling, toppings) */}
          {showOptionalAddons && optionGroups.map((group) => {
            const gs = optionState[group.id]
            return (
              <section key={group.id} className="mb-4">
                <h3 className="mb-2 text-xs font-bold text-foreground">{group.name}</h3>
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
                          else {
                            const current = gs?.quantities[opt.id] ?? 0
                            if (current === 0) handleOptionQuantity(group.id, opt.id, 1)
                          }
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

        {/* ── Footer with price + confirm button ── */}
        <div className="shrink-0 border-t border-border px-4 py-3">
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-all",
              canConfirm
                ? "bg-primary text-primary-foreground active:opacity-90"
                : "bg-muted text-muted-foreground"
            )}
          >
            <span>{"담기"}</span>
            <span>{formatPrice(totalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
