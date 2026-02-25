"use client"

import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

type QuantityControlProps = {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  unit?: string
  size?: "sm" | "md"
  dark?: boolean
}

export function QuantityControl({
  value,
  onChange,
  min = 0,
  max = 99,
  unit,
  size = "md",
  dark = false,
}: QuantityControlProps) {
  const isSmall = size === "sm"

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full border transition-colors disabled:opacity-30",
          dark
            ? "border-gray-500 text-gray-300 active:bg-gray-600"
            : "border-border active:bg-muted",
          isSmall ? "h-7 w-7" : "h-8 w-8"
        )}
        aria-label={"\uAC10\uC18C"}
      >
        <Minus className={isSmall ? "h-3 w-3" : "h-3.5 w-3.5"} />
      </button>
      <span
        className={cn(
          "min-w-[2rem] text-center font-bold",
          dark ? "text-white" : "text-primary",
          isSmall ? "text-sm" : "text-base"
        )}
      >
        {value}
        {unit && <span className={cn("text-xs font-normal", dark ? "text-gray-400" : "text-muted-foreground")}>{unit}</span>}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full border transition-colors disabled:opacity-30",
          dark
            ? "border-gray-500 text-gray-300 active:bg-gray-600"
            : "border-border active:bg-muted",
          isSmall ? "h-7 w-7" : "h-8 w-8"
        )}
        aria-label={"\uC99D\uAC00"}
      >
        <Plus className={isSmall ? "h-3 w-3" : "h-3.5 w-3.5"} />
      </button>
    </div>
  )
}
