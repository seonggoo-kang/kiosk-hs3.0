"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect, useRef, useCallback } from "react"
import { ShoppingBag, Store, Accessibility, Sun, Search, Languages } from "lucide-react"
import { useOrder } from "@/lib/order-context"

const ADS = [
  "/images/ads/ad-1.jpg",
  "/images/ads/ad-2.jpg",
  "/images/ads/ad-3.jpg",
]

const AD_INTERVAL = 5000 // 5 seconds per ad
const IDLE_TIMEOUT = 60000 // 60 seconds to return to screensaver

export default function LandingPage() {
  const router = useRouter()
  const { dispatch } = useOrder()

  // Screensaver state
  const [isIdle, setIsIdle] = useState(true)
  const [currentAd, setCurrentAd] = useState(0)
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const adIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const handleOrderType = (type: "takeout" | "dine-in") => {
    dispatch({ type: "SET_ORDER_TYPE", payload: type })
    router.push("/menu")
  }

  // ── Ad rotation (only when idle) ──
  useEffect(() => {
    if (!isIdle) {
      if (adIntervalRef.current) clearInterval(adIntervalRef.current)
      return
    }
    adIntervalRef.current = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % ADS.length)
    }, AD_INTERVAL)
    return () => {
      if (adIntervalRef.current) clearInterval(adIntervalRef.current)
    }
  }, [isIdle])

  // ── Wake up: dismiss screensaver on any interaction ──
  const wake = useCallback(() => {
    if (isIdle) setIsIdle(false)

    // Reset idle timer
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    idleTimerRef.current = setTimeout(() => {
      setIsIdle(true)
    }, IDLE_TIMEOUT)
  }, [isIdle])

  useEffect(() => {
    const events = ["pointerdown", "pointermove", "touchstart", "click", "keydown"] as const
    const handler = () => wake()
    events.forEach((e) => window.addEventListener(e, handler, { passive: true }))
    return () => {
      events.forEach((e) => window.removeEventListener(e, handler))
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [wake])

  return (
    <div className="relative flex flex-1 flex-col">
      {/* ═══════════════════════════════════════════
          BACKGROUND LAYER -- always mounted
          The landing page with hero, logo, CTAs
          ═══════════════════════════════════════════ */}
      
      {/* Background image: current ad as the bg when awake */}
      <div className="absolute inset-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ADS[currentAd]}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/70" />
      </div>

      {/* Logo at top */}
      <div className="relative z-10 flex flex-col items-center pt-14">
        <img
          src="/images/br-logo.png"
          alt="Baskin Robbins"
          className="h-20 w-auto drop-shadow-lg"
        />
        <p className="mt-2 text-lg font-bold tracking-widest text-white/90 drop-shadow-md">
          BASKIN ROBBINS
        </p>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Order type buttons */}
      <div
        className="relative z-10 px-5 pb-4 transition-all duration-500"
        style={{
          opacity: isIdle ? 0 : 1,
          transform: isIdle ? "translateY(20px)" : "translateY(0)",
          pointerEvents: isIdle ? "none" : "auto",
        }}
      >
        <div className="flex gap-4">
          <button
            onClick={() => handleOrderType("takeout")}
            className="flex flex-1 flex-col items-center gap-3 rounded-2xl bg-white/95 py-6 shadow-lg backdrop-blur-sm transition-all active:scale-[0.97]"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
              <ShoppingBag className="h-7 w-7 text-primary" />
            </div>
            <span className="text-base font-bold text-foreground">{"가져가기"}</span>
          </button>
          <button
            onClick={() => handleOrderType("dine-in")}
            className="flex flex-1 flex-col items-center gap-3 rounded-2xl bg-white/95 py-6 shadow-lg backdrop-blur-sm transition-all active:scale-[0.97]"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
              <Store className="h-7 w-7 text-primary" />
            </div>
            <span className="text-base font-bold text-foreground">{"먹고가기"}</span>
          </button>
        </div>
      </div>

      {/* Bottom accessibility bar */}
      <div
        className="relative z-10 flex shrink-0 items-center justify-between bg-black/50 px-4 py-3 backdrop-blur-sm transition-all duration-500"
        style={{
          opacity: isIdle ? 0 : 1,
          transform: isIdle ? "translateY(10px)" : "translateY(0)",
          pointerEvents: isIdle ? "none" : "auto",
        }}
      >
        <p className="text-xs font-medium text-white/70">{"카운터에서도 주문할 수 있어요."}</p>
        <div className="flex items-center gap-4">
          <button className="flex flex-col items-center gap-0.5" aria-label="낮은자세">
            <Accessibility className="h-5 w-5 text-white/70" />
            <span className="text-[10px] text-white/70">{"낮은자세"}</span>
          </button>
          <button className="flex flex-col items-center gap-0.5" aria-label="고대비">
            <Sun className="h-5 w-5 text-white/70" />
            <span className="text-[10px] text-white/70">{"고대비"}</span>
          </button>
          <button className="flex flex-col items-center gap-0.5" aria-label="돋보기">
            <Search className="h-5 w-5 text-white/70" />
            <span className="text-[10px] text-white/70">{"돋보기"}</span>
          </button>
          <button className="flex flex-col items-center gap-0.5" aria-label="Language">
            <Languages className="h-5 w-5 text-white/70" />
            <span className="text-[10px] text-white/70">Language</span>
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          FOREGROUND LAYER -- screensaver overlay
          Fullscreen ads that crossfade, dissolves away on interaction
          ═══════════════════════════════════════════ */}
      <div
        className="absolute inset-0 z-20 overflow-hidden transition-opacity duration-500 ease-out"
        style={{
          opacity: isIdle ? 1 : 0,
          pointerEvents: isIdle ? "auto" : "none",
        }}
      >
        {/* All 3 ad images stacked, crossfade via opacity */}
        {ADS.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 overflow-hidden transition-opacity duration-1000 ease-in-out"
            style={{ opacity: currentAd === i ? 1 : 0 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              className="absolute inset-0 h-full w-full animate-ken-burns object-cover"
            />
          </div>
        ))}

        {/* Subtle gradient vignette for cinematic feel */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

        {/* "Touch to order" prompt - pulses gently */}
        <div className="absolute inset-x-0 bottom-12 flex justify-center">
          <p className="animate-pulse text-sm font-medium tracking-wider text-white/80 drop-shadow-lg">
            {"화면을 터치해주세요"}
          </p>
        </div>
      </div>
    </div>
  )
}
