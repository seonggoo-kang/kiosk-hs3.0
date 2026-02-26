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
  /** Pill style wraps buttons and value in a rounded border */
  pill?: boolean
}

export function QuantityControl({
  value,
  onChange,
  min = 0,
  max = 99,
  unit,
  size = "md",
  dark = false,
  pill = false,
}: QuantityControlProps) {
  const isSmall = size === "sm"
  const btnSize = isSmall ? "h-6 w-6" : "h-7 w-7"
  const iconSize = isSmall ? "h-3 w-3" : "h-3.5 w-3.5"

  const content = (
    <>
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full transition-colors disabled:opacity-30",
          pill ? "" : "border",
          dark
            ? "border-muted-foreground/50 text-muted-foreground active:bg-muted/20"
            : "border-border text-muted-foreground active:bg-muted",
          btnSize
        )}
        aria-label="감소"
      >
        <Minus className={iconSize} />
      </button>
      <span
        className={cn(
          "min-w-[1.75rem] text-center font-bold tabular-nums",
          dark ? "text-white" : "text-primary",
          isSmall ? "text-xs" : "text-sm"
        )}
      >
        {value}
        {unit && <span className={cn("ml-0.5 text-[10px] font-normal", dark ? "text-muted-foreground" : "text-muted-foreground")}>{unit}</span>}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full transition-colors disabled:opacity-30",
          pill ? "" : "border",
          dark
            ? "border-muted-foreground/50 text-muted-foreground active:bg-muted/20"
            : "border-border text-muted-foreground active:bg-muted",
          btnSize
        )}
        aria-label="증가"
      >
        <Plus className={iconSize} />
      </button>
    </>
  )

  if (pill) {
    return (
      <div className={cn(
        "inline-flex items-center gap-1 rounded-full border px-1.5 py-1",
        dark ? "border-muted-foreground/30 bg-muted/10" : "border-border bg-card"
      )}>
        {content}
      </div>
    )
  }

  return <div className="flex items-center gap-1">{content}</div>
}
