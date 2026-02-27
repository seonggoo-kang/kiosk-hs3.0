"use client"

import { useEffect, useState } from "react"

/**
 * Device profiles for the kiosk application:
 *
 *   Portrait Kiosk:   1080 x 1920  →  logical 480 x 853  (×2.25 scale)
 *   Landscape Tablet: 1280 x 800   →  logical 800 x 500  (×1.6 scale)
 *   Mobile:           native viewport (no scaling, fully responsive)
 */

// Portrait kiosk (standing kiosk)
const KIOSK_PORTRAIT_W = 480
const KIOSK_PORTRAIT_H = 853

// Landscape tablet kiosk (table order)
const KIOSK_LANDSCAPE_W = 800
const KIOSK_LANDSCAPE_H = 500

const MOBILE_BREAKPOINT = 768
const LANDSCAPE_MIN_WIDTH = 1024

export type DeviceMode = "mobile" | "kiosk-portrait" | "kiosk-landscape"

function detectDeviceMode(): DeviceMode {
  if (typeof window === "undefined") return "kiosk-portrait"
  
  const width = window.innerWidth
  const height = window.innerHeight
  const isTouchCapable = "ontouchstart" in window || navigator.maxTouchPoints > 0
  const isLandscape = width > height
  
  // Mobile: narrow screen + touch capable + portrait
  if (width < MOBILE_BREAKPOINT && isTouchCapable) {
    return "mobile"
  }
  
  // Landscape tablet: wide screen + landscape orientation
  if (isLandscape && width >= LANDSCAPE_MIN_WIDTH) {
    return "kiosk-landscape"
  }
  
  // Default: portrait kiosk
  return "kiosk-portrait"
}

function computePortraitScale() {
  const vw = window.innerWidth
  const vh = window.innerHeight
  return Math.min(vw / KIOSK_PORTRAIT_W, vh / KIOSK_PORTRAIT_H)
}

function computeLandscapeScale() {
  const vw = window.innerWidth
  const vh = window.innerHeight
  return Math.min(vw / KIOSK_LANDSCAPE_W, vh / KIOSK_LANDSCAPE_H)
}

export function KioskScaler() {
  useEffect(() => {
    const update = () => {
      const mode = detectDeviceMode()
      
      // Set data attribute for CSS targeting
      document.documentElement.setAttribute("data-device", mode)
      
      switch (mode) {
        case "mobile":
          document.documentElement.style.setProperty("--kiosk-scale", "1")
          document.documentElement.style.setProperty("--kiosk-w", "100vw")
          document.documentElement.style.setProperty("--kiosk-h", "100dvh")
          document.documentElement.style.setProperty("--is-mobile", "1")
          document.documentElement.style.setProperty("--is-landscape", "0")
          break
          
        case "kiosk-landscape":
          document.documentElement.style.setProperty("--kiosk-scale", String(computeLandscapeScale()))
          document.documentElement.style.setProperty("--kiosk-w", `${KIOSK_LANDSCAPE_W}px`)
          document.documentElement.style.setProperty("--kiosk-h", `${KIOSK_LANDSCAPE_H}px`)
          document.documentElement.style.setProperty("--is-mobile", "0")
          document.documentElement.style.setProperty("--is-landscape", "1")
          break
          
        case "kiosk-portrait":
        default:
          document.documentElement.style.setProperty("--kiosk-scale", String(computePortraitScale()))
          document.documentElement.style.setProperty("--kiosk-w", `${KIOSK_PORTRAIT_W}px`)
          document.documentElement.style.setProperty("--kiosk-h", `${KIOSK_PORTRAIT_H}px`)
          document.documentElement.style.setProperty("--is-mobile", "0")
          document.documentElement.style.setProperty("--is-landscape", "0")
          break
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

// Hook for components that need to know the current device mode
export function useDeviceMode() {
  const [mode, setMode] = useState<DeviceMode>("kiosk-portrait")
  
  useEffect(() => {
    const check = () => setMode(detectDeviceMode())
    check()
    window.addEventListener("resize", check)
    window.addEventListener("orientationchange", check)
    return () => {
      window.removeEventListener("resize", check)
      window.removeEventListener("orientationchange", check)
    }
  }, [])
  
  return mode
}

// Convenience hooks
export function useIsMobile() {
  return useDeviceMode() === "mobile"
}

export function useIsLandscape() {
  return useDeviceMode() === "kiosk-landscape"
}
