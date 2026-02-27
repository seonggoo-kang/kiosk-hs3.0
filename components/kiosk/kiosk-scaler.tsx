"use client"

import { useEffect, useState } from "react"

/**
 * Kiosk hardware profiles.
 * The logical viewport is the CSS design surface (authored layout).
 * On the real hardware, the scale factor maps logical → physical pixels.
 *
 *   Standing kiosk: 1080 x 1920  →  logical 480 x 853  (×2.25)
 *   Table order:    800  x 1280  →  logical 480 x 768  (×1.667)  [future]
 *   Mobile:         native viewport (no scaling, fully responsive)
 */
const KIOSK_LOGICAL_W = 480
const KIOSK_LOGICAL_H = 853
const MOBILE_BREAKPOINT = 768

function isMobileDevice() {
  if (typeof window === "undefined") return false
  const width = window.innerWidth
  const isTouchCapable = "ontouchstart" in window || navigator.maxTouchPoints > 0
  const isNarrow = width < MOBILE_BREAKPOINT
  // Mobile: narrow screen + touch capable
  return isNarrow && isTouchCapable
}

function computeScale() {
  const vw = window.innerWidth
  const vh = window.innerHeight
  return Math.min(vw / KIOSK_LOGICAL_W, vh / KIOSK_LOGICAL_H)
}

export function KioskScaler() {
  useEffect(() => {
    const update = () => {
      const mobile = isMobileDevice()
      
      // Set CSS custom property for mobile detection
      document.documentElement.style.setProperty(
        "--is-mobile",
        mobile ? "1" : "0"
      )
      document.documentElement.setAttribute("data-device", mobile ? "mobile" : "kiosk")
      
      if (mobile) {
        // Mobile: no scaling, use native viewport
        document.documentElement.style.setProperty("--kiosk-scale", "1")
        document.documentElement.style.setProperty("--kiosk-w", "100vw")
        document.documentElement.style.setProperty("--kiosk-h", "100dvh")
      } else {
        // Kiosk: fixed logical size with scaling
        document.documentElement.style.setProperty("--kiosk-scale", String(computeScale()))
        document.documentElement.style.setProperty("--kiosk-w", `${KIOSK_LOGICAL_W}px`)
        document.documentElement.style.setProperty("--kiosk-h", `${KIOSK_LOGICAL_H}px`)
      }
    }
    
    update()
    window.addEventListener("resize", update)
    window.addEventListener("orientationchange", update)
    return () => {
      window.removeEventListener("resize", update)
      window.removeEventListener("orientationchange", update)
    }
  }, [])

  return null
}

// Hook for components that need to know if we're in mobile mode
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const check = () => setIsMobile(isMobileDevice())
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])
  
  return isMobile
}
