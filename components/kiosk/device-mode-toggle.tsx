"use client"

import { useState, useEffect, useRef } from "react"
import { Monitor, Smartphone, Tablet, X } from "lucide-react"
import { useDeviceModeWithOverride, type DeviceMode } from "./kiosk-scaler"

const modeConfig: Record<DeviceMode, { icon: typeof Monitor; label: string; shortLabel: string }> = {
  "kiosk-portrait": { icon: Monitor, label: "키오스크 (세로)", shortLabel: "세로" },
  "kiosk-landscape": { icon: Tablet, label: "태블릿 (가로)", shortLabel: "가로" },
  "mobile": { icon: Smartphone, label: "모바일", shortLabel: "모바일" },
}

/**
 * Hidden device mode toggle for testing/demos.
 * - Double-tap the small dot in top-left corner to reveal
 * - Or press 'D' key on keyboard
 */
export function DeviceModeToggle() {
  const { mode, isOverridden, cycle, clear } = useDeviceModeWithOverride()
  const [isVisible, setIsVisible] = useState(false)
  const lastTapRef = useRef(0)

  const config = modeConfig[mode]
  const Icon = config.icon

  // Keyboard shortcut: Press 'D' to toggle visibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "d" || e.key === "D") {
        setIsVisible(v => !v)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Double-tap detection
  const handleTap = () => {
    const now = Date.now()
    if (now - lastTapRef.current < 400) {
      setIsVisible(true)
    }
    lastTapRef.current = now
  }

  const handleCycle = () => {
    cycle()
  }

  const handleClear = () => {
    clear()
    setIsVisible(false)
  }

  return (
    <>
      {/* Hidden tap area - small dot in top-left corner */}
      {!isVisible && (
        <button
          type="button"
          onClick={handleTap}
          className="fixed left-2 top-2 z-[9999] h-6 w-6 rounded-full bg-white/20 backdrop-blur-sm"
          aria-label="모드 전환 (더블탭)"
        />
      )}

      {/* Floating toggle panel */}
      {isVisible && (
        <div className="fixed left-2 top-2 z-[9999] flex items-center gap-2 rounded-lg bg-foreground/95 px-3 py-2 text-background shadow-lg">
          {/* Mode indicator + cycle button */}
          <button
            type="button"
            onClick={handleCycle}
            className="flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-background/20 active:bg-background/30"
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
            type="button"
            onClick={handleClear}
            className="ml-1 rounded p-1 transition-colors hover:bg-background/20 active:bg-background/30"
            aria-label="닫기"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </>
  )
}
