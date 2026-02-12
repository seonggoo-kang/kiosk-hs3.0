"use client"

import { cn } from "@/lib/utils"
import { formatPrice } from "@/lib/mock-data"
import { QuantityControl } from "./quantity-control"

type OptionSelectorProps = {
  name: string
  priceAdd?: number
  isSelected: boolean
  onSelect: () => void
  hasQuantity?: boolean
  quantity?: number
  onQuantityChange?: (qty: number) => void
  unit?: string
}

export function OptionSelector({
  name,
  priceAdd = 0,
  isSelected,
  onSelect,
  hasQuantity = false,
  quantity = 0,
  onQuantityChange,
  unit,
}: OptionSelectorProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 p-3 transition-all active:scale-[0.97]",
        isSelected
          ? "border-primary bg-accent"
          : "border-border bg-card"
      )}
    >
      <span className="text-sm font-semibold text-foreground">
        {name}
        {priceAdd > 0 && (
          <span className="ml-1 text-xs font-bold text-primary">
            +{formatPrice(priceAdd)}
          </span>
        )}
      </span>
      {hasQuantity && isSelected && onQuantityChange && (
        <QuantityControl
          value={quantity}
          onChange={onQuantityChange}
          min={0}
          max={99}
          unit={unit}
          size="sm"
        />
      )}
    </button>
  )
}
