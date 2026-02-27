"use client"

import { useState } from "react"
import { Monitor, Smartphone, Tablet, X } from "lucide-react"
import { useDeviceModeWithOverride, type DeviceMode } from "./kiosk-scaler"
import { cn } from "@/lib/utils"

const modeConfig: Record<DeviceMode, { icon: typeof Monitor; label: string; shortLabel: string }> = {
  "kiosk-portrait": { icon: Monitor, label: "키오스크 (세로)", shortLabel: "세로" },
  "kiosk-landscape": { icon: Tablet, label: "태블릿 (가로)", shortLabel: "가로" },
  "mobile": { icon: Smartphone, label: "모바일", shortLabel: "모바일" },
}

/**
 * Hidden device mode toggle for testing/demos.
 * Triple-tap the corner to reveal, tap to cycle modes.
 */
export function DeviceModeToggle() {
  const { mode, isOverridden, cycle, clear } = useDeviceModeWithOverride()
  const [isVisible, setIsVisible] = useState(false)
  const [tapCount, setTapCount] = useState(0)
  const [lastTap, setLastTap] = useState(0)

  const config = modeConfig[mode]
  const Icon = config.icon

  // Triple-tap detection for hidden toggle
  const handleCornerTap = () => {
    const now = Date.now()
    if (now - lastTap < 500) {
      const newCount = tapCount + 1
      setTapCount(newCount)
      if (newCount >= 3) {
        setIsVisible(true)
        setTapCount(0)
      }
    } else {
      setTapCount(1)
    }
    setLastTap(now)
  }

  const handleCycle = () => {
    const newMode = cycle()
  }

  const handleClear = () => {
    clear()
    setIsVisible(false)
  }

  return (
    <>
      {/* Hidden tap area in top-left corner */}
      <div
        className="fixed left-0 top-0 z-[9999] h-12 w-12"
        onClick={handleCornerTap}
        aria-hidden="true"
      />

      {/* Floating toggle panel */}
      {isVisible && (
        <div className="fixed left-3 top-3 z-[9999] flex items-center gap-2 rounded-lg bg-foreground/90 px-3 py-2 text-background shadow-lg backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Mode indicator + cycle button */}
          <button
            onClick={handleCycle}
            className="flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-background/20"
          >
            <Icon className="h-4 w-4" />
            <span className="text-xs font-medium">{config.shortLabel}</span>
          </button>

          {/* Override indicator */}
          {isOverridden && (
            <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
              수동
            </span>
          )}

          {/* Clear/close button */}
          <button
            onClick={handleClear}
            className="ml-1 rounded p-1 transition-colors hover:bg-background/20"
            aria-label="자동 모드로 복귀"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </>
  )
}
