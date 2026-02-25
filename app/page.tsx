"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect, useRef, useCallback } from "react"
import { ShoppingBag, Store, Accessibility, Sun, Search, Languages } from "lucide-react"
import { useOrder } from "@/lib/order-context"

const SLIDE_INTERVAL = 5000 // 5 seconds per banner
const IDLE_TIMEOUT = 60000 // 60 seconds to return to idle

export default function LandingPage() {
  const router = useRouter()
  const { dispatch } = useOrder()

  // ── State ──
  const [banners, setBanners] = useState<string[]>([])
  const [isIdle, setIsIdle] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  // ── Fetch banners dynamically from public/banners/ ──
  useEffect(() => {
    fetch("/api/banners")
      .then((r) => r.json())
      .then((imgs: string[]) => {
        if (imgs.length > 0) setBanners(imgs)
      })
      .catch(() => {
        // silently fail -- no banners to show
      })
  }, [])
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const slideTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const handleOrderType = (type: "takeout" | "dine-in") => {
    dispatch({ type: "SET_ORDER_TYPE", payload: type })
    router.push("/menu")
  }

  // ── Auto-slide: always runs, loops infinitely ──
  useEffect(() => {
    if (banners.length <= 1) return
    slideTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, SLIDE_INTERVAL)
    return () => {
      if (slideTimerRef.current) clearInterval(slideTimerRef.current)
    }
  }, [banners.length])

  // ── Wake up: dismiss idle on any interaction ──
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

  // ── Manual swipe support for active-mode banner ──
  const touchStartX = useRef(0)
  const touchDelta = useRef(0)
  const [dragX, setDragX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const onBannerPointerDown = useCallback((e: React.PointerEvent) => {
    if (isIdle) return // no manual swipe in idle mode
    touchStartX.current = e.clientX
    touchDelta.current = 0
    setIsDragging(true)
    setDragX(0)
  }, [isIdle])

  const onBannerPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return
    const dx = e.clientX - touchStartX.current
    touchDelta.current = dx
    setDragX(dx)
  }, [isDragging])

  const onBannerPointerUp = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)
    const threshold = 60

    if (touchDelta.current < -threshold && currentIndex < banners.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else if (touchDelta.current > threshold && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
    setDragX(0)
    touchDelta.current = 0
  }, [isDragging, currentIndex])

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-black">
      {/* ═══════════════════════════════════════════
          BANNER SLIDER -- always present
          In idle: fills the full screen
          In active: shrinks to top ~43%
          ═══════════════════════════════════════════ */}
      <div
        className="relative w-full overflow-hidden transition-all duration-500 ease-out"
        style={{
          flex: "1 1 0%",
          minHeight: 0,
        }}
        onPointerDown={onBannerPointerDown}
        onPointerMove={onBannerPointerMove}
        onPointerUp={onBannerPointerUp}
        onPointerCancel={onBannerPointerUp}
      >
        {/* Slide strip */}
        {banners.length > 0 ? (
          <div
            className="flex h-full"
            style={{
              width: `${banners.length * 100}%`,
              transform: `translateX(calc(-${currentIndex * (100 / banners.length)}% + ${isDragging && !isIdle ? dragX : 0}px))`,
              transition: isDragging ? "none" : "transform 600ms ease-out",
            }}
          >
            {banners.map((src, i) => (
              <div
                key={src}
                className="relative h-full shrink-0"
                style={{ width: `${100 / banners.length}%` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`Promotional banner ${i + 1}`}
                  className="h-full w-full object-contain object-top"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary/5">
            <img
              src="/images/br-logo.png"
              alt="Baskin Robbins"
              className="h-20 w-auto opacity-40"
            />
          </div>
        )}

        {/* Gradient overlay for idle mode prompt */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent transition-opacity duration-500"
          style={{ opacity: isIdle ? 1 : 0 }}
        />

        {/* Page indicator dots */}
        {banners.length > 1 && (
          <div
            className="absolute bottom-4 left-0 right-0 z-10 flex items-center justify-center gap-2 transition-all duration-500"
            style={{ bottom: isIdle ? "48px" : "10px" }}
            aria-hidden="true"
          >
            {banners.map((_, i) => (
              <span
                key={i}
                className={`rounded-full transition-all duration-400 ${
                  i === currentIndex
                    ? "h-2 w-5 bg-white"
                    : "h-2 w-2 bg-white/40"
                }`}
              />
            ))}
          </div>
        )}

        {/* "Touch to order" prompt -- only visible when idle */}
        <div
          className="absolute inset-x-0 bottom-5 flex justify-center transition-opacity duration-500"
          style={{ opacity: isIdle ? 1 : 0, pointerEvents: isIdle ? "auto" : "none" }}
        >
          <p className="animate-pulse text-base font-semibold tracking-widest text-white drop-shadow-lg">
            {"화면을 터치해주세요"}
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          ACTIVE CONTENT -- CTAs + accessibility
          Hidden when idle, slides in when active
          ═══════════════════════════════════════════ */}
      <div
        className="flex shrink-0 flex-col bg-background transition-all duration-500 ease-out overflow-hidden"
        style={{
          opacity: isIdle ? 0 : 1,
          maxHeight: isIdle ? "0px" : "260px",
          transform: isIdle ? "translateY(20px)" : "translateY(0)",
          pointerEvents: isIdle ? "none" : "auto",
        }}
      >
        {/* Order type buttons */}
        <div className="flex flex-1 gap-3 px-4 pt-5 pb-4">
          <button
            onClick={() => handleOrderType("takeout")}
            className="flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl bg-card py-6 shadow-sm ring-1 ring-border transition-all active:scale-[0.97]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
            <span className="text-sm font-bold text-foreground">{"가져가기"}</span>
          </button>
          <button
            onClick={() => handleOrderType("dine-in")}
            className="flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl bg-card py-6 shadow-sm ring-1 ring-border transition-all active:scale-[0.97]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Store className="h-6 w-6 text-primary" />
            </div>
            <span className="text-sm font-bold text-foreground">{"먹고가기"}</span>
          </button>
        </div>

        {/* Bottom accessibility bar */}
        <div className="flex items-center justify-between bg-muted/80 px-4 py-2.5">
          <p className="text-[11px] font-medium text-muted-foreground">{"카운터에서도 주문할 수 있어요."}</p>
          <div className="flex items-center gap-3">
            <button className="flex flex-col items-center gap-0.5" aria-label="낮은자세">
              <Accessibility className="h-4 w-4 text-muted-foreground" />
              <span className="text-[9px] text-muted-foreground">{"낮은자세"}</span>
            </button>
            <button className="flex flex-col items-center gap-0.5" aria-label="고대비">
              <Sun className="h-4 w-4 text-muted-foreground" />
              <span className="text-[9px] text-muted-foreground">{"고대비"}</span>
            </button>
            <button className="flex flex-col items-center gap-0.5" aria-label="돋보기">
              <Search className="h-4 w-4 text-muted-foreground" />
              <span className="text-[9px] text-muted-foreground">{"돋보기"}</span>
            </button>
            <button className="flex flex-col items-center gap-0.5" aria-label="Language">
              <Languages className="h-4 w-4 text-muted-foreground" />
              <span className="text-[9px] text-muted-foreground">Language</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
