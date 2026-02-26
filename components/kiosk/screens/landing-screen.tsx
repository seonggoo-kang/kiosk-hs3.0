"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ShoppingBag, Store, Accessibility, Sun, Search, Languages } from "lucide-react"
import type { BannerItem } from "@/app/api/banners/route"

const SLIDE_INTERVAL = 5000 // images: 5 seconds
const IDLE_TIMEOUT = 60000 // 60 seconds to return to idle
const SHORT_VIDEO_THRESHOLD = 3000 // videos shorter than 3s loop once before advancing

interface LandingScreenProps {
  onSelectOrderType: (type: "takeout" | "dine-in") => void
}

export function LandingScreen({ onSelectOrderType }: LandingScreenProps) {
  const [banners, setBanners] = useState<BannerItem[]>([])
  const [isIdle, setIsIdle] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Track which short videos have completed their first loop
  const shortVideoLoopedRef = useRef(false)

  // Refs for video elements so we can listen to ended events
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map())

  useEffect(() => {
    console.log("[v0] LandingScreen: Starting banner fetch...")
    fetch("/api/banners")
      .then((r) => r.json())
      .then((items: BannerItem[]) => {
        console.log("[v0] LandingScreen: Banner fetch complete, got", items.length, "items")
        if (items.length > 0) setBanners(items)
      })
      .catch((err) => {
        console.error("[v0] LandingScreen: Banner fetch failed", err)
      })
  }, [])

  // ── Duration-aware auto-advance ──
  const slideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const advanceSlide = useCallback(() => {
    if (banners.length <= 1) return
    setCurrentIndex((prev) => (prev + 1) % banners.length)
    shortVideoLoopedRef.current = false
  }, [banners.length])

  const clearSlideTimer = useCallback(() => {
    if (slideTimerRef.current) {
      clearTimeout(slideTimerRef.current)
      slideTimerRef.current = null
    }
  }, [])

  // Schedule next advance based on current slide type
  useEffect(() => {
    if (banners.length <= 1) return

    const current = banners[currentIndex]

    if (current.type === "image") {
      // Images use fixed timer
      clearSlideTimer()
      slideTimerRef.current = setTimeout(advanceSlide, SLIDE_INTERVAL)
    }
    // Videos use their `ended` event (handled in onVideoEnded)

    return clearSlideTimer
  }, [currentIndex, banners, advanceSlide, clearSlideTimer])

  const onVideoEnded = useCallback(
    (index: number) => {
      if (index !== currentIndex) return

      // Check if video is short -- if so, loop once before advancing
      const video = videoRefs.current.get(index)
      if (video && video.duration * 1000 < SHORT_VIDEO_THRESHOLD && !shortVideoLoopedRef.current) {
        shortVideoLoopedRef.current = true
        video.play()
        return
      }

      advanceSlide()
    },
    [currentIndex, advanceSlide]
  )

  // Ensure the current video plays when we land on it
  useEffect(() => {
    const current = banners[currentIndex]
    if (current?.type === "video") {
      const video = videoRefs.current.get(currentIndex)
      if (video) {
        video.currentTime = 0
        video.play().catch(() => {})
      }
    }
  }, [currentIndex, banners])

  // ── Idle / Wake ──
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const wake = useCallback(() => {
    if (isIdle) setIsIdle(false)
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    idleTimerRef.current = setTimeout(() => setIsIdle(true), IDLE_TIMEOUT)
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

  // ── Swipe gestures ──
  const touchStartX = useRef(0)
  const touchDelta = useRef(0)
  const [dragX, setDragX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const onBannerPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (isIdle) return
      touchStartX.current = e.clientX
      touchDelta.current = 0
      setIsDragging(true)
      setDragX(0)
    },
    [isIdle]
  )

  const onBannerPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return
      const dx = e.clientX - touchStartX.current
      touchDelta.current = dx
      setDragX(dx)
    },
    [isDragging]
  )

  const onBannerPointerUp = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)
    const threshold = 60
    if (touchDelta.current < -threshold && currentIndex < banners.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      shortVideoLoopedRef.current = false
    } else if (touchDelta.current > threshold && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
      shortVideoLoopedRef.current = false
    }
    setDragX(0)
    touchDelta.current = 0
  }, [isDragging, currentIndex, banners.length])

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-background">
      {/* Banner slider */}
      <div
        className="relative w-full overflow-hidden bg-background transition-all duration-500 ease-out"
        style={{ flex: "1 1 0%", minHeight: 0 }}
        onPointerDown={onBannerPointerDown}
        onPointerMove={onBannerPointerMove}
        onPointerUp={onBannerPointerUp}
        onPointerCancel={onBannerPointerUp}
      >
        {banners.length > 0 ? (
          <div
            className="flex h-full"
            style={{
              width: `${banners.length * 100}%`,
              transform: `translateX(calc(-${currentIndex * (100 / banners.length)}% + ${isDragging && !isIdle ? dragX : 0}px))`,
              transition: isDragging ? "none" : "transform 600ms ease-out",
            }}
          >
            {banners.map((item, i) => (
              <div key={item.src} className="relative h-full shrink-0" style={{ width: `${100 / banners.length}%` }}>
                {item.type === "video" ? (
                  <video
                    ref={(el) => {
                      if (el) videoRefs.current.set(i, el)
                      else videoRefs.current.delete(i)
                    }}
                    src={item.src}
                    autoPlay={i === 0}
                    muted
                    playsInline
                    preload="auto"
                    onEnded={() => onVideoEnded(i)}
                    className="h-full w-full object-contain object-top"
                    draggable={false}
                  />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={item.src}
                    alt={`Promotional banner ${i + 1}`}
                    className="h-full w-full object-contain object-top"
                    draggable={false}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary/5">
            <img src="/images/br-logo.png" alt="Baskin Robbins" className="h-20 w-auto opacity-40" />
          </div>
        )}

        {/* Idle gradient overlay */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent transition-opacity duration-500"
          style={{ opacity: isIdle ? 1 : 0 }}
        />

        {/* Dot indicators */}
        {banners.length > 1 && (
          <div
            className="absolute left-0 right-0 z-10 flex items-center justify-center gap-1.5 transition-all duration-500"
            style={{ bottom: isIdle ? "48px" : "10px" }}
            aria-hidden="true"
          >
            {banners.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? "w-4 bg-primary" : "w-1.5 bg-border"
                }`}
              />
            ))}
          </div>
        )}

        {/* Idle "touch to start" prompt */}
        <div
          className="absolute inset-x-0 bottom-5 flex justify-center transition-opacity duration-500"
          style={{ opacity: isIdle ? 1 : 0, pointerEvents: isIdle ? "auto" : "none" }}
        >
          <p className="animate-pulse text-base font-semibold tracking-widest text-white drop-shadow-lg">
            {"화면을 터치해주세요"}
          </p>
        </div>
      </div>

      {/* CTAs */}
      <div
        className="flex shrink-0 flex-col bg-background transition-all duration-500 ease-out overflow-hidden"
        style={{
          opacity: isIdle ? 0 : 1,
          maxHeight: isIdle ? "0px" : "260px",
          transform: isIdle ? "translateY(20px)" : "translateY(0)",
          pointerEvents: isIdle ? "none" : "auto",
        }}
      >
        <div className="flex flex-1 gap-3 px-4 pt-5 pb-4">
          <button
            onClick={() => onSelectOrderType("takeout")}
            className="flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl bg-card py-6 shadow-sm ring-1 ring-border transition-all active:scale-[0.97]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
            <span className="text-sm font-bold text-foreground">{"가져가기"}</span>
          </button>
          <button
            onClick={() => onSelectOrderType("dine-in")}
            className="flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl bg-card py-6 shadow-sm ring-1 ring-border transition-all active:scale-[0.97]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Store className="h-6 w-6 text-primary" />
            </div>
            <span className="text-sm font-bold text-foreground">{"먹고가기"}</span>
          </button>
        </div>

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
