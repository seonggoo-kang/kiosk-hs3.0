"use client"

import { cn } from "@/lib/utils"

type ActionBarProps = {
  onBack: () => void
  onPrimary: () => void
  backLabel?: string
  primaryLabel: string
  primaryDisabled?: boolean
}

export function ActionBar({
  onBack,
  onPrimary,
  backLabel = "이전으로",
  primaryLabel,
  primaryDisabled = false,
}: ActionBarProps) {
  return (
    <div className="flex shrink-0 gap-3 bg-panel px-screen pb-2 pt-2">
      <button
        onClick={onBack}
        className="flex h-button flex-1 items-center justify-center rounded-xl bg-secondary text-sm font-bold text-secondary-foreground transition-colors active:opacity-80"
      >
        {backLabel}
      </button>
      <button
        onClick={onPrimary}
        disabled={primaryDisabled}
        className={cn(
          "flex h-button flex-1 items-center justify-center rounded-xl text-sm font-bold transition-colors active:opacity-80",
          primaryDisabled
            ? "bg-muted text-muted-foreground"
            : "bg-primary text-primary-foreground"
        )}
      >
        {primaryLabel}
      </button>
    </div>
  )
}
