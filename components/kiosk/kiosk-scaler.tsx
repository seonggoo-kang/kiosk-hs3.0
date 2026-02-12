"use client"

import { useEffect } from "react"

/**
 * Kiosk hardware profiles.
 * The logical viewport is the CSS design surface (authored layout).
 * On the real hardware, the scale factor maps logical → physical pixels.
 *
 *   Standing kiosk: 1080 x 1920  →  logical 480 x 853  (×2.25)
 *   Table order:    800  x 1280  →  logical 480 x 768  (×1.667)  [future]
 */
const KIOSK_LOGICAL_W = 480
const KIOSK_LOGICAL_H = 853

function computeScale() {
  const vw = window.innerWidth
  const vh = window.innerHeight
  return Math.min(vw / KIOSK_LOGICAL_W, vh / KIOSK_LOGICAL_H)
}

export function KioskScaler() {
  useEffect(() => {
    const update = () => {
      document.documentElement.style.setProperty(
        "--kiosk-scale",
        String(computeScale())
      )
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  return null
}
