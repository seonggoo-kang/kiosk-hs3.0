"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import Image from "next/image"

// ── Promotion data ──────────────────────────────────────────
export type PromoBanner = {
  id: string
  badge: string
  headline: string
  description: string[]
  period?: string
  detailImage: string
  accentColor: string
  overlayGradient: string
  targetCategoryId?: string // navigates to this category when CTA tapped
}

export const eventPromotions: PromoBanner[] = [
  {
    id: "super-week",
    badge: "해피오더",
    headline: "SUPER WEEK\n최대 5천원 OFF!",
    description: [
      "새로워진 해피오더 슈퍼위크!",
      "Coupon Zone에서 원하는 브랜드 쿠폰 다운!",
      "Bonus Zone에서 더 많은 혜택 확인하세요",
    ],
    period: "02.09 - 02.22",
    detailImage: "/promos/event-superweek.jpg",
    accentColor: "hsl(340, 75%, 55%)",
    overlayGradient: "from-rose-900/90 via-rose-900/60 to-transparent",
    targetCategoryId: "cone-cup",
  },
  {
    id: "flavor-of-month",
    badge: "이달의 맛",
    headline: "진정한 쫀꾸렛",
    description: [
      "바삭 쫀득 초콜릿 아이스크림에",
      "초콜릿 쿠키와 브라우니가 가득!",
      "2월 한정 스페셜 플레이버",
    ],
    period: "02.01 - 02.28",
    detailImage: "/promos/event-flavor-month.jpg",
    accentColor: "hsl(25, 60%, 45%)",
    overlayGradient: "from-amber-950/90 via-amber-950/60 to-transparent",
    targetCategoryId: "cone-cup",
  },
  {
    id: "double-cup",
    badge: "이달의 더블컵",
    headline: "싱글레귤러 +500원\n더블주니어로 UP!",
    description: [
      "이달의 맛 포함 싱글레귤러 주문 시",
      "500원만 추가하면 더블주니어!",
      "매장 방문 고객 한정 혜택",
    ],
    period: "02.01 - 02.28",
    detailImage: "/promos/event-double-cup.jpg",
    accentColor: "hsl(340, 70%, 55%)",
    overlayGradient: "from-pink-900/90 via-pink-900/60 to-transparent",
    targetCategoryId: "cone-cup",
  },
  {
    id: "dubai-mochi",
    badge: "신제품 출시",
    headline: "두바이st 모찌 &\n두바이st 파르페",
    description: [
      "쫀득 바삭 두바이st 모찌 신메뉴!",
      "원물 가득 두바이st 파르페도 함께",
      "지금 매장에서 만나보세요",
    ],
    detailImage: "/promos/event-dubai-mochi.jpg",
    accentColor: "hsl(170, 60%, 40%)",
    overlayGradient: "from-teal-900/90 via-teal-900/60 to-transparent",
    targetCategoryId: "dessert",
  },
  {
    id: "card-discount",
    badge: "삼성카드 LINK",
    headline: "삼성카드로 결제시\n2천원 즉시 할인!",
    description: [
      "삼성카드 LINK 연결 후 결제 시",
      "18,500원 이상 결제 시 2,000원 OFF",
      "해피포인트 앱에서 LINK 연결하세요",
    ],
    period: "02.01 - 02.28",
    detailImage: "/promos/event-card-discount.jpg",
    accentColor: "hsl(215, 80%, 55%)",
    overlayGradient: "from-blue-950/90 via-blue-950/60 to-transparent",
  },
  {
    id: "coupon-zone",
    badge: "쿠폰존",
    headline: "브랜드별 쿠폰\n최대 5,000원!",
    description: [
      "파스쿠찌 배달/픽업 5,000원 할인",
      "쉐이크쉑 배달/픽업 4,000원 할인",
      "잠바주스 배달/픽업 4,000원 할인",
    ],
    period: "02.09 - 02.22",
    detailImage: "/promos/event-coupon-zone.jpg",
    accentColor: "hsl(40, 90%, 50%)",
    overlayGradient: "from-orange-950/90 via-orange-950/60 to-transparent",
  },
  {
    id: "t-membership",
    badge: "T멤버십",
    headline: "T멤버십 회원이라면\n무료 배달 + 10% 할인!",
    description: [
      "Happy Order x T membership Grand Open!",
      "무료배달 월 1회 + 10% 할인/적립 일 1회",
      "T 플러스포인트 사용 상시 가능",
    ],
    detailImage: "/promos/event-tmembership.jpg",
    accentColor: "hsl(280, 70%, 55%)",
    overlayGradient: "from-purple-950/90 via-purple-950/60 to-transparent",
  },
  {
    id: "free-delivery",
    badge: "배달비 FREE",
    headline: "패션파이브·커피앳웍스\n배달비 무료!",
    description: [
      "패션파이브 25,000원 이상 주문 시 배달비 FREE",
      "커피앳웍스 18,000원 이상 주문 시 배달비 FREE",
      "해피오더 슈퍼위크 기간 한정",
    ],
    period: "02.09 - 02.22",
    detailImage: "/promos/event-free-delivery.jpg",
    accentColor: "hsl(155, 65%, 42%)",
    overlayGradient: "from-emerald-950/90 via-emerald-950/60 to-transparent",
  },
]

const TOTAL = eventPromotions.length

// ── Component ───────────────────────────────────────────────
export function EventPromoBanners({
  onOverflowDrag,
  onOverflowCommit,
  onOverflowCancel,
  canOverflowLeft,
  canOverflowRight,
  onPromoCTA,
}: {
  onOverflowDrag?: (dx: number) => void
  onOverflowCommit?: (direction: "left" | "right") => void
  onOverflowCancel?: () => void
  canOverflowLeft?: boolean
  canOverflowRight?: boolean
  onPromoCTA?: (categoryId: string) => void
}) {
  const [currentIdx, setCurrentIdx] = useState(0)

  // ── Hero swipe via a STRIP of all slides, translateX-based ──
  const heroRef = useRef<HTMLDivElement>(null)
  const [heroX, setHeroX] = useState(0) // px offset during drag
  const [heroAnimating, setHeroAnimating] = useState(false)

  // Refs for stable access inside window-level handlers
  const idxRef = useRef(currentIdx)
  useEffect(() => { idxRef.current = currentIdx }, [currentIdx])
  const overflowDragRef = useRef(onOverflowDrag)
  useEffect(() => { overflowDragRef.current = onOverflowDrag }, [onOverflowDrag])
  const overflowCommitRef = useRef(onOverflowCommit)
  useEffect(() => { overflowCommitRef.current = onOverflowCommit }, [onOverflowCommit])
  const overflowCancelRef = useRef(onOverflowCancel)
  useEffect(() => { overflowCancelRef.current = onOverflowCancel }, [onOverflowCancel])
  const canLeftRef = useRef(canOverflowLeft)
  useEffect(() => { canLeftRef.current = canOverflowLeft }, [canOverflowLeft])
  const canRightRef = useRef(canOverflowRight)
  useEffect(() => { canRightRef.current = canOverflowRight }, [canOverflowRight])
  const animRef = useRef(false)
  const isOverflowing = useRef(false) // true when drag has passed into outer carousel
  const startX = useRef(0)
  const startY = useRef(0)
  const dragging = useRef(false)
  const locked = useRef<"h" | "v" | null>(null)
  const offsetX = useRef(0)

  // All pointer handling via imperative window listeners for reliability
  const pidRef = useRef<number | null>(null)

  const handleDown = useCallback((e: React.PointerEvent) => {
    if (animRef.current) return
    // Stop outer category carousel from also starting a drag
    e.stopPropagation()
    e.preventDefault()
    startX.current = e.clientX
    startY.current = e.clientY
    dragging.current = true
    locked.current = null
    offsetX.current = 0
    setHeroX(0)
    pidRef.current = e.pointerId
  }, [])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragging.current || pidRef.current !== e.pointerId) return
      const dx = e.clientX - startX.current
      const dy = e.clientY - startY.current

      if (!locked.current && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
        locked.current = Math.abs(dx) >= Math.abs(dy) ? "h" : "v"
      }
      if (locked.current !== "h") return

      const idx = idxRef.current
      const atLastAndLeft = idx === TOTAL - 1 && dx < 0
      const atFirstAndRight = idx === 0 && dx > 0

      // If at the edge and can overflow, pass the drag to the outer carousel
      if (atLastAndLeft && canLeftRef.current) {
        isOverflowing.current = true
        overflowDragRef.current?.(dx) // negative dx -> outer moves left
        setHeroX(0) // hero stays still
        offsetX.current = dx
        return
      }
      if (atFirstAndRight && canRightRef.current) {
        isOverflowing.current = true
        overflowDragRef.current?.(dx) // positive dx -> outer moves right
        setHeroX(0)
        offsetX.current = dx
        return
      }

      // If we were overflowing but now dragged back into hero range, reclaim
      if (isOverflowing.current) {
        isOverflowing.current = false
        overflowDragRef.current?.(0) // reset outer
      }

      // Normal hero drag within promo range
      let off = dx
      if ((idx === 0 && dx > 0) || (idx === TOTAL - 1 && dx < 0)) {
        off = dx * 0.15 // rubber-band at dead edges
      }
      offsetX.current = off
      setHeroX(off)
    }

    const onUp = (e: PointerEvent) => {
      if (!dragging.current || pidRef.current !== e.pointerId) return
      dragging.current = false
      pidRef.current = null

      const dx = offsetX.current
      const w = heroRef.current?.offsetWidth ?? 400
      const threshold = w * 0.18
      const idx = idxRef.current

      // If we were overflowing into the outer carousel
      if (isOverflowing.current) {
        isOverflowing.current = false
        if (Math.abs(dx) > threshold) {
          // Commit the outer carousel transition
          overflowCommitRef.current?.(dx < 0 ? "left" : "right")
        } else {
          // Snap back the outer carousel
          overflowCancelRef.current?.()
        }
        offsetX.current = 0
        locked.current = null
        return
      }

      if (dx < -threshold && idx < TOTAL - 1) {
        // Swipe left -> next promo
        animRef.current = true
        setHeroAnimating(true)
        setHeroX(-w)
        setTimeout(() => {
          setCurrentIdx(idx + 1)
          setHeroX(0)
          setHeroAnimating(false)
          animRef.current = false
        }, 250)
      } else if (dx > threshold && idx > 0) {
        // Swipe right -> prev promo
        animRef.current = true
        setHeroAnimating(true)
        setHeroX(w)
        setTimeout(() => {
          setCurrentIdx(idx - 1)
          setHeroX(0)
          setHeroAnimating(false)
          animRef.current = false
        }, 250)
      } else {
        // Snap back
        animRef.current = true
        setHeroAnimating(true)
        setHeroX(0)
        setTimeout(() => {
          setHeroAnimating(false)
          animRef.current = false
        }, 200)
      }
      offsetX.current = 0
      locked.current = null
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerup", onUp)
    window.addEventListener("pointercancel", onUp)
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
      window.removeEventListener("pointercancel", onUp)
    }
  }, [])

  // ── Thumbnail strip ──
  const stripRef = useRef<HTMLDivElement>(null)
  const stripStartX = useRef(0)
  const stripScrollStart = useRef(0)
  const stripDragged = useRef(false)

  const onStripDown = useCallback((e: React.PointerEvent) => {
    e.stopPropagation()
    stripStartX.current = e.clientX
    stripScrollStart.current = stripRef.current?.scrollLeft ?? 0
    stripDragged.current = false
  }, [])

  const onStripMove = useCallback((e: React.PointerEvent) => {
    if (e.buttons === 0) return
    const dx = e.clientX - stripStartX.current
    if (Math.abs(dx) > 4) stripDragged.current = true
    if (stripRef.current) {
      stripRef.current.scrollLeft = stripScrollStart.current - dx
    }
  }, [])

  const handleThumbClick = useCallback((idx: number) => {
    if (!stripDragged.current) setCurrentIdx(idx)
  }, [])

  // Auto-scroll thumbnail strip to keep active one centered
  useEffect(() => {
    const el = stripRef.current
    if (!el) return
    const thumb = el.children[currentIdx] as HTMLElement | undefined
    if (thumb) {
      const left = thumb.offsetLeft - el.offsetWidth / 2 + thumb.offsetWidth / 2
      el.scrollTo({ left, behavior: "smooth" })
    }
  }, [currentIdx])

  // ── Derived values ──
  const selected = eventPromotions[currentIdx]
  const prevPromo = currentIdx > 0 ? eventPromotions[currentIdx - 1] : null
  const nextPromo = currentIdx < TOTAL - 1 ? eventPromotions[currentIdx + 1] : null

  // The base X translate for the "strip" approach:
  // Current slide sits at 0, prev at -100%, next at +100%.
  // During drag, all three shift by heroX pixels.

  return (
    <div className="flex h-full flex-col">
      {/* ── Hero banner carousel ── */}
      <div
        ref={heroRef}
        className="relative flex-1 min-h-0 overflow-hidden select-none"
        style={{ touchAction: "pan-y" }}
        onPointerDown={handleDown}
      >
        {/* Prev slide */}
        {prevPromo && (
          <div
            className="absolute inset-0 will-change-transform"
            style={{
              transform: `translateX(calc(-100% + ${heroX}px))`,
              transition: heroAnimating ? "transform 250ms ease-out" : "none",
            }}
          >
            <HeroBanner promo={prevPromo} onCTA={onPromoCTA} />
          </div>
        )}

        {/* Current slide */}
        <div
          className="absolute inset-0 will-change-transform"
          style={{
            transform: heroX !== 0 ? `translateX(${heroX}px)` : undefined,
            transition: heroAnimating ? "transform 250ms ease-out" : "none",
          }}
        >
          <HeroBanner promo={selected} onCTA={onPromoCTA} />
        </div>

        {/* Next slide */}
        {nextPromo && (
          <div
            className="absolute inset-0 will-change-transform"
            style={{
              transform: `translateX(calc(100% + ${heroX}px))`,
              transition: heroAnimating ? "transform 250ms ease-out" : "none",
            }}
          >
            <HeroBanner promo={nextPromo} onCTA={onPromoCTA} />
          </div>
        )}

        {/* Swipe edge hints */}
        {prevPromo && (
          <div
            className="pointer-events-none absolute left-0 top-0 z-10 h-full w-3 bg-gradient-to-r from-black/10 to-transparent"
            aria-hidden="true"
          />
        )}
        {nextPromo && (
          <div
            className="pointer-events-none absolute right-0 top-0 z-10 h-full w-3 bg-gradient-to-l from-black/10 to-transparent"
            aria-hidden="true"
          />
        )}

        {/* Page dots */}
        <div
          className="pointer-events-none absolute bottom-14 left-0 right-0 z-10 flex items-center justify-center gap-1.5"
          aria-hidden="true"
        >
          {eventPromotions.map((_, i) => (
            <span
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === currentIdx
                  ? "h-1.5 w-4 bg-white"
                  : "h-1.5 w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── Thumbnail strip ── */}
      <div className="shrink-0 border-t border-border bg-card">
        <div
          ref={stripRef}
          className="flex gap-2.5 overflow-x-auto px-3 py-2.5 scrollbar-hide select-none"
          onPointerDown={onStripDown}
          onPointerMove={onStripMove}
        >
          {eventPromotions.map((promo, idx) => (
            <button
              key={promo.id}
              onClick={() => handleThumbClick(idx)}
              className="group relative shrink-0 overflow-hidden rounded-lg transition-all duration-200"
              style={{
                width: 72,
                height: 90,
                outline:
                  idx === currentIdx
                    ? `2.5px solid ${promo.accentColor}`
                    : "2.5px solid transparent",
                outlineOffset: 1,
              }}
            >
              <Image
                src={promo.detailImage}
                alt={promo.badge}
                fill
                className="object-cover"
                sizes="72px"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-1 pb-1 pt-5">
                <p className="truncate text-[8px] font-bold leading-tight text-white">
                  {promo.badge}
                </p>
              </div>
              {idx === currentIdx && (
                <div
                  className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: promo.accentColor }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Extracted hero banner slide ─────────────────────────────
function HeroBanner({
  promo,
  onCTA,
}: {
  promo: PromoBanner
  onCTA?: (categoryId: string) => void
}) {
  return (
    <div className="relative h-full w-full">
      <Image
        src={promo.detailImage}
        alt={promo.headline}
        fill
        className="object-cover"
        sizes="480px"
        priority
        loading="eager"
      />
      <div
        className={`absolute inset-x-0 bottom-0 flex flex-col gap-1.5 bg-gradient-to-t ${promo.overlayGradient} px-4 pb-4 pt-16`}
      >
        <span
          className="w-fit rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white"
          style={{ backgroundColor: promo.accentColor }}
        >
          {promo.badge}
        </span>
        <h2 className="whitespace-pre-line text-[18px] font-extrabold leading-tight text-white drop-shadow-md">
          {promo.headline}
        </h2>
        <div className="flex flex-col gap-0.5">
          {promo.description.map((line, i) => (
            <p key={i} className="text-[11px] leading-snug text-white/85">
              {line}
            </p>
          ))}
        </div>
        {promo.period && (
          <span className="mt-0.5 text-[10px] font-medium text-white/60">
            {promo.period}
          </span>
        )}
        {promo.targetCategoryId && onCTA && (
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onCTA(promo.targetCategoryId!)}
            className="mt-2 w-fit rounded-full px-5 py-2 text-xs font-bold text-white transition-transform active:scale-95"
            style={{ backgroundColor: promo.accentColor }}
          >
            {'이 프로모션으로 주문하기'}
          </button>
        )}
      </div>
    </div>
  )
}
